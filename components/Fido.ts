import { NhsLogin } from "./NhsLogin";

import ReactNativeBiometrics from "react-native-biometrics";

import ReactNative, { Alert } from 'react-native';

const { FidoUAF } = ReactNative.NativeModules;
const FacetID = "android:apk-key-hash-sha256:47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU";

export class Fido {
    async register(accessToken: string, onError: (err: string) => void) {
        const result: string = await FidoUAF.FidoUafRegister({ accessToken: accessToken, facetId: FacetID, url: "https://uaf.sandpit.signin.nhs.uk/regRequest" });
        const resultJson = JSON.parse(result);
        if (resultJson.error) {
            Alert.alert("Fingerprint Error", resultJson.error,
                [
                    {
                        text: "Cancel",
                        onPress: () => undefined,
                        style: "cancel"
                    },
                    {
                        text: "Continue",
                        onPress: () => { }
                    }
                ]);
            return;
        }
        console.log(resultJson);
        const res = await fetch("https://uaf.sandpit.signin.nhs.uk/regResponse", {
            method: "POST",
            body: resultJson
        }).then((res) => res.json()).catch((err) => {
            console.log(err);
        });
        console.log(res);
    }

    async auth(): Promise<string> {
        const result: string = await FidoUAF.FidoUafAuthenticate({
            facetId: FacetID,
            url: "https://uaf.sandpit.signin.nhs.uk/authRequest"
        });

        return result;
    }

    async ToBase64Url(s: string): Promise<string> {
        return await FidoUAF.ToBase64Url({
            input: s
        });
    }
}