package com.nhsloginapp;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricPrompt;

import com.facebook.react.bridge.Promise;
import com.nhs.online.fidoclient.uaf.crypto.FidoSigner;
import com.nhs.online.fidoclient.uaf.crypto.FidoSignerAndroidM;
import com.nhs.online.fidoclient.uaf.operationcall.AuthenticationCall;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;

public class SignatureCallback extends BiometricPrompt.AuthenticationCallback {
    private FidoUAF main;
    private Promise promise;
    public SignatureCallback(FidoUAF main, Promise promise){
        this.main = main;
        this.promise = promise;
    }

    @Override
    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
        super.onAuthenticationSucceeded(result);
        try {
            main.FingerprintResponse(result.getCryptoObject(), promise);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        }
//        BiometricPrompt.CryptoObject cryptoObject = result.getCryptoObject();
//        Signature cryptoSignature = cryptoObject.getSignature();
//        FidoSigner fidoSigner = new FidoSignerAndroidM(cryptoObject.getSignature());
//        AuthenticationCall authenticationCall = new AuthenticationCall();
//            String msg = authenticationCall.

    }
}
