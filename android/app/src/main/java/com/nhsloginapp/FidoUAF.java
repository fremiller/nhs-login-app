package com.nhsloginapp;

import android.annotation.SuppressLint;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.hardware.fingerprint.FingerprintManager;
import android.os.Build;
import android.os.Bundle;

import android.util.Log;


import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.biometric.BiometricPrompt.PromptInfo;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.gson.Gson;
import com.nhs.online.fidoclient.uaf.client.AuthAssertionBuilder;
import com.nhs.online.fidoclient.uaf.client.RegAssertionBuilder;
import com.nhs.online.fidoclient.uaf.client.operation.Authentication;
import com.nhs.online.fidoclient.uaf.client.operation.Registration;
import com.nhs.online.fidoclient.uaf.crypto.Base64url;
import com.nhs.online.fidoclient.uaf.crypto.FidoKeystore;
import com.nhs.online.fidoclient.uaf.crypto.FidoKeystoreAndroidM;
import com.nhs.online.fidoclient.uaf.crypto.FidoSigner;
import com.nhs.online.fidoclient.uaf.crypto.FidoSignerAndroidM;
import com.nhs.online.fidoclient.uaf.crypto.KeyCodec;
import com.nhs.online.fidoclient.uaf.message.AuthenticationRequest;
import com.nhs.online.fidoclient.uaf.message.RegistrationRequest;
import com.nhs.online.fidoclient.uaf.message.RegistrationResponse;
import com.nhs.online.fidoclient.uaf.operationcall.AuthenticationCall;
import com.nhs.online.fidoclient.uaf.operationcall.RegistrationCall;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Security;
import java.security.Signature;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class FidoUAF extends ReactContextBaseJavaModule {

    @Override
    public String getName(){
        return "FidoUAF";
    }
    private ReactApplicationContext mContext;

    FidoUAF(ReactApplicationContext context) {
        super(context);
        mContext = context;

        fidoKeystore = new FidoKeystoreAndroidM("du-nhs-login-fingerprint");
    }

    private Registration reg;

    FidoKeystore fidoKeystore;

    private boolean authOnly = true;

    private RegistrationRequest req;

    @ReactMethod
    public void FidoUafRegister(final ReadableMap params, final Promise promise) {
        String fingerPrintError = canFingerprint(mContext);
        if (fingerPrintError != ""){
            promise.resolve("{\"error\": \""+fingerPrintError+"\"}");
            return;
        }
        String accessToken = params.getString("accessToken");
        String facetId = params.getString("facetId");
        String url = params.getString("url");
        // Log.d("FidoUAFRegister");
        reg = new Registration();
        String regMessage = reg.requestUafRegistrationMessage(facetId, accessToken, url);
        req = reg.getRegistrationRequest(regMessage);
        KeyPair keyPair = fidoKeystore.generateKeyPair("test");
        authOnly = true;
        DoFingerprintReq(promise);
    }

    private AuthenticationRequest authReq;
    private String authRequestResponse;
    private Authentication auth;

    @ReactMethod
    public void FidoUafAuthenticate(final ReadableMap params, final Promise promise){
        String fingerPrintError = canFingerprint(mContext);
        if (fingerPrintError != ""){
            promise.resolve("{\"error\": \""+fingerPrintError+"\"}");
            return;
        }
        String facetId = params.getString("facetId");
        String url = params.getString("url");
        auth = new Authentication();
        authRequestResponse = auth.requestUafAuthenticationMessage(facetId, url);
        authOnly = false;
        DoFingerprintReq(promise);
    }

    @ReactMethod
    public void ToBase64Url(final ReadableMap params, Promise promise)  {
        String input = params.getString("input");
        input = input.replaceAll("\\\\\"", "\"");
        promise.resolve(Base64url.INSTANCE.encodeToString(input.getBytes()));
    }

//    private String getUsername(){
////        SharedPreferences settings = mContext.getSharedPreferences("Preferances")
//    }

    public void FingerprintResponse(BiometricPrompt.CryptoObject crypto, Promise promise) throws NoSuchAlgorithmException, InvalidKeyException {
        if (authOnly){
            Signature signature = crypto.getSignature();
            RegistrationResponse res = reg.processRequest(req, new RegAssertionBuilder(fidoKeystore.getPublicKey("test"), signature, "foo"));
            Gson g = new Gson();
            promise.resolve(g.toJson(res));
        }
        else {
            FidoSigner signer = new FidoSignerAndroidM(crypto.getSignature());
            KeyPair pair = fidoKeystore.getKeyPair("test");
            String res = auth.auth(authRequestResponse, new AuthAssertionBuilder(signer, pair, "foo"));
//            String b64 = Base64url.INSTANCE.encodeToString(res.getBytes());
//            auth.getUafProtocolMessage(res);
            promise.resolve(res);
        }
    }

    private static String canFingerprint(ReactApplicationContext context){
        @SuppressLint("WrongConstant") int biometricInfo = BiometricManager.from(context).canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG);
        if (biometricInfo == BiometricManager.BIOMETRIC_SUCCESS){
            return "";
        }
        if (biometricInfo == BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE){
            return "Your fingerprint reader is not available";
        }
        if (biometricInfo == BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED){
            return "You do not have any fingerprints enrolled, enrol one in settings";
        }
        if (biometricInfo == BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE){
            return "Your phone does not have an eligible fingerprint reader";
        }
        return "";
    }

    private void DoFingerprintReq(Promise promise) {
        FidoUAF mInstance = this;
        UiThreadUtil.runOnUiThread(
                () -> {
                    Signature signature = null;
                    try {
                        signature = Signature.getInstance("SHA256withECDSA");

                        KeyPair kp = fidoKeystore.getKeyPair("test");
                        if (kp == null){
                            promise.resolve("{\"error\": \"Fingerprint not registered\"}");
                            return;
                        }
                        PrivateKey privateKey = kp.getPrivate();
                        signature.initSign(privateKey);

                        BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(signature);

                        FragmentActivity fragmentActivity = (FragmentActivity) getCurrentActivity();
                        SignatureCallback signatureCallback = new SignatureCallback(mInstance, promise);

                        Executor executor = Executors.newSingleThreadExecutor();
                        BiometricPrompt biometricPrompt = new BiometricPrompt(fragmentActivity, executor, signatureCallback);
                        PromptInfo promptInfo = new PromptInfo.Builder()
                                .setTitle("Continue with NHS Login")
                                .setNegativeButtonText("Cancel")
                                .build();
                        biometricPrompt.authenticate(promptInfo, cryptoObject);
                    } catch (NoSuchAlgorithmException e) {
                        promise.resolve("{\"error\": \"NoSuchAlgorithmException\"}");
                    } catch (InvalidKeyException e){
                        promise.resolve("{\"error\": \"InvalidKeyException\"}");
                    } catch (RuntimeException e) {
                        promise.resolve("{\"error\": \"Fingerprint not registered with NHS Login.\"}");
                    }
                }
        );
    }

    private PrivateKey privateKeyFromString(String key) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
        return KeyCodec.INSTANCE.getPrivKey(Base64url.INSTANCE.decode(key));
    }

    private PublicKey publicKeyFromString(String key) throws InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
        return KeyCodec.INSTANCE.getPubKey(Base64url.INSTANCE.decode(key));
    }
}
