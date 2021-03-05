import { Linking } from 'react-native';
import MMKVStorage from "react-native-mmkv-storage";
import jwt_decode from "jwt-decode";
// import { MessagingInstance, setMessagingInstance } from '../services';
import { Messaging } from './Messaging';

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

export interface AuthConfiguration {
    issuer: string,
    clientId: string,
    redirectUrl: string,
    scopes: string[],
    vtr: string
}

export class NhsLogin {
    static instance: NhsLogin;
    config: AuthConfiguration = {
        issuer: 'https://auth.sandpit.signin.nhs.uk',
        clientId: 'du-nhs-login',
        redirectUrl: 'https://du-nhs-login.herokuapp.com/code',
        scopes: ['openid'],
        vtr: "[\"P0.Cp\"]"
    }

    nhsUserInfo: any;

    idToken?: string;

    appServerUrl: string = "";

    env: Environment = {
        client_id: "",
        name: "",
        url: ""
    };

    mmkv = new MMKVStorage.Loader().initialize();

    constructor() {
        this._constructor();
        Linking.addEventListener("url", this.onDeepLink);
        NhsLogin.instance = this;
    }

    async updateEnvironment(appServerUrl: string, env: Environment) {
        await this.mmkv.setStringAsync("server_url", appServerUrl);
        await this.mmkv.setMapAsync("env", env);
        this.appServerUrl = appServerUrl;
        this.env = env;
        this.updateConfigFromEnv();
    }

    updateConfigFromEnv() {
        this.config.clientId = this.env.client_id;
        this.config.issuer = this.env.url;
    }

    async _constructor() {
        this.appServerUrl = await this.mmkv.getStringAsync("server_url");
        const new_env = await this.mmkv.getMapAsync("env") as Environment;
        if (new_env && new_env.client_id) {
            this.env = new_env;
        }
        console.log(this.env);
        this.updateConfigFromEnv();
    }

    readyToAuthorise() {
        return (this.config.clientId && this.config.clientId.length > 0);
    }

    buildAuthoriseUrl(): string {
        return this.config.issuer + `/authorize?client_id=${this.config.clientId}&scope=${this.config.scopes.join("%20")}&response_type=code&redirect_uri=${this.config.redirectUrl}`
    }

    onIdTokenReceived?: () => void;

    onDeepLink(evt: { url: string }) {
        const _this = NhsLogin.instance;
        console.log(evt.url);
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params: any = {},
        match;
        while (match = regex.exec(evt.url)) {
            params[match[1]] = match[2];
        }
        let {token} = params;
        // console.log(token);
        if (!token || token == "undefined") {
            token = undefined;
            return;
        }
        _this.idToken = token;
        if (!_this.idToken){
            return;
        }
        _this.idTokenDecode(_this.idToken);
        if (NhsLogin.instance.onIdTokenReceived) {
            NhsLogin.instance.onIdTokenReceived();
        }
    }

    idTokenDecode(idToken: string) {
        NhsLogin.instance.nhsUserInfo = jwt_decode(idToken);
        console.log(NhsLogin.instance.nhsUserInfo);
    }

    NhsLoginAuthorise(onComplete: () => void) {
        console.log(`Logging in with scopes: ${this.config.scopes}`);
        Linking.openURL(NhsLogin.instance.buildAuthoriseUrl());
        NhsLogin.instance.onIdTokenReceived = onComplete;
        // let result = await authorize(this.config).catch((e) => {
        //     console.log(e);
        // });
        // if (!result){
        //     return;
        // }
        // console.log(`Authorization code: ${result.authorizationCode}`);
        // await this.AuthorizationCodeExchange(result.authorizationCode);
    }

    async AuthorizationCodeExchange(authCode: string) {
        const nhsAuthResponse = await fetch(this.appServerUrl + "/code?code=" + authCode, {
            method: "POST",
        }).then(async (res) => {
            return await res.json();
        }).catch(err => {
            console.log(err);
            return undefined;
        });
        if (!nhsAuthResponse) {
            return;
        }
        this.nhsUserInfo = nhsAuthResponse.nhsUserInfo;
        if (nhsAuthResponse.chat) {
            // setMessagingInstance(new Messaging(this.appServerUrl, nhsAuthResponse.appToken));
        }
    }

    GetScopes(): {
        name: string,
        enabled: boolean,
        disabled: boolean
    }[] {
        return possibleScopes.map((scope) => {
            return { name: scope, enabled: this.config.scopes.indexOf(scope) != -1, disabled: scope == 'openid' }
        })
    }

    SetScopes(scopes: string[]) {
        console.log(`new scopes: ${scopes}`);
        this.config.scopes = scopes;
    }
}
