import { NhsLogin } from "./NhsLogin";

import ReactNativeBiometrics from "react-native-biometrics";

import ReactNative from 'react-native';

const { FidoUAF } = ReactNative.NativeModules;

export class Fido {
    async register(accessToken: string){
        const result: string = await FidoUAF.FidoUafRegister({accessToken: accessToken, facetId: "https://du-nhs-login.herokuapp.com", url: "https://uaf.sandpit.signin.nhs.uk/regRequest"});
    }

    async auth(): Promise<string> {
        const result: string = await FidoUAF.FidoUafAuthenticate({
            facetId: "https://du-nhs-login.herokuapp.com",
            url: "https://uaf.sandpit.signin.nhs.uk/authRequest"
        });
        return result;
    }

    ToBase64Url(s: string){
        return FidoUAF.ToBase64Url(s);
    }
}