import { AuthConfiguration, authorize } from 'react-native-app-auth';

const possibleScopes = [
    'openid',
    'profile',
    'profile_extended',
    'email',
    'phone',
    'gp_registration_details',
    'gp_integration_credentials',
    'client_metadata'
]

export class NhsLogin {
    config: AuthConfiguration = {
        issuer: 'https://auth.sandpit.signin.nhs.uk',
        clientId: 'du-nhs-login',
        redirectUrl: 'com.nhsloginapp://oauth',
        scopes: ['openid'],
        skipCodeExchange: true,
        dangerouslyAllowInsecureHttpRequests: true,
    }

    nhsUserInfo: any;

    appServerUrl: string = "http://192.168.1.43:3000";

    async NhsLoginAuthorise() {
        // console.log(`Logging in with scopes: ${this.config.scopes}`);
        // let result = await authorize(this.config).catch((e) => {
        //     console.log(e);
        // });
        // if (!result){
        //     return;
        // }
        // console.log(`Authorization code: ${result.authorizationCode}`);
        await this.AuthorizationCodeExchange("pog");
    }

    async AuthorizationCodeExchange(authCode: string){
        const nhsAuthResponse = await fetch("http://192.168.1.43:3000/code?code=" + authCode, {
            method: "POST",
        }).then(async (res) => {
            return await res.json();
        }).catch(err => {
            console.log(err);
            return undefined;
        });
        if (!nhsAuthResponse){
            return;
        }
        this.nhsUserInfo = nhsAuthResponse.nhsUserInfo;
    }

    GetScopes(): {
        name: string,
        enabled: boolean,
        disabled: boolean
    }[] {
        return possibleScopes.map((scope)=> {
            return {name: scope, enabled: this.config.scopes.indexOf(scope) != -1, disabled: scope == 'openid'}
        })
    }

    SetScopes(scopes: string[]){
        console.log(`new scopes: ${scopes}`);
        this.config.scopes = scopes;
    }
}
