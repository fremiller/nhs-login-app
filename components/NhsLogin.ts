import { AuthConfiguration, authorize } from 'react-native-app-auth';
import MMKVStorage from "react-native-mmkv-storage";

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

export interface Environment {
    client_id: string,
    url: string,
    name: string,
}

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

    appServerUrl: string = "";

    env: Environment;

    mmkv = new MMKVStorage.Loader().initialize();

    constructor(){
        
    }

    async updateEnvironment(appServerUrl: string, env: Environment){
        await this.mmkv.setStringAsync("server_url", appServerUrl);
        await this.mmkv.setStringAsync("env.client_id", env.client_id);
        await this.mmkv.setStringAsync("env.name", env.name);
        await this.mmkv.setStringAsync("env.url", env.url);
        this.appServerUrl = appServerUrl;
        this.env = env;
        this.updateConfigFromEnv();
    }

    updateConfigFromEnv(){
        this.config.clientId = this.env.client_id;
        this.config.issuer = this.env.url;
    }

    async _constructor(){
        this.appServerUrl = await this.mmkv.getStringAsync("server_url");
        this.env.client_id = await this.mmkv.getStringAsync("env.client_id");
        this.env.name = await this.mmkv.getStringAsync("env.name");
        this.env.url = await this.mmkv.getStringAsync("env.url");
        console.log(this.env);
        this.updateConfigFromEnv();
    }

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
        const nhsAuthResponse = await fetch(this.appServerUrl + "/code?code=" + authCode, {
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
