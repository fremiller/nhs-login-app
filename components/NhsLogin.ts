/* eslint-disable no-new */
import {Alert, Linking} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import jwt_decode from 'jwt-decode';
// import { MessagingInstance, setMessagingInstance } from '../services';
import {Messaging} from './Messaging';

import {CustomTabs} from 'react-native-custom-tabs';
import {Fido} from './Fido';

import * as Colors from '../styles/colors';

const possibleScopes = [
  'openid',
  'profile',
  'profile_extended',
  'email',
  'phone',
  'gp_registration_details',
  'gp_integration_credentials',
  'client_metadata',
];

export interface Environment {
  client_id: string;
  url: string;
  name: string;
}

export interface AuthConfiguration {
  issuer: string;
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  vtr: string;
}

type WebViewType = 'browser' | 'webview' | 'tab';

export interface OpenIDConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  scopes_supported: string[];
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  claims_supported: string[];
  userinfo_endpoint: string;
  token_endpoint_auth_signing_alg_values_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  fido_uaf_authentication_request_endpoint: string;
  fido_uaf_registration_request_endpoint: string;
  fido_uaf_registration_response_endpoint: string;
  fido_uaf_deregistration_endpoint: string;
}

export class NhsLogin {
  static instance: NhsLogin;
  config: AuthConfiguration = {
    issuer: 'https://auth.sandpit.signin.nhs.uk',
    clientId: 'du-nhs-login',
    redirectUrl: 'https://du-nhs-login.herokuapp.com/code',
    scopes: ['openid', 'profile'],
    vtr: '["P0.Cp"]',
  };

  nhsIdTokenPayload: any;

  idToken?: string;
  nhsAccessToken: string = '';

  appAccessToken: string = '';

  appServerUrl: string = '';

  chatEnabled: boolean = false;
  chatDisabledMessage: string = '';

  env: Environment = {
    client_id: '',
    name: '',
    url: '',
  };

  mmkv = new MMKVStorage.Loader().initialize();
  lastAuthorizationCode = '';

  fingerprintEnabled: boolean = false;

  currentOpenIdConfiguration?: OpenIDConfiguration;

  constructor() {
    if (NhsLogin.instance) {
      console.warn('NhsLogin instance already exists!');
      return;
    }
    this._constructor();
    Linking.addEventListener('url', this.onDeepLink);
    NhsLogin.instance = this;
  }

  async saveFidoUsername(username: string) {
    await this.mmkv.setStringAsync('fido_username', username);
  }

  getFidoUsername(): Promise<string> {
    return this.mmkv.getStringAsync('fido_username');
  }

  async updateEnvironment(appServerUrl: string, env: Environment) {
    const openIdConfig = await this.getOpenIDConfiguration(env);
    if (!openIdConfig) {
      Alert.alert(
        'Environment Error',
        'Could not connect to login server. Check server URL',
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
      );
      return;
    }
    await this.mmkv.setStringAsync('server_url', appServerUrl);
    await this.mmkv.setMapAsync('env', env);
    this.appServerUrl = appServerUrl;
    this.env = env;
    this.updateConfigFromEnv();
  }

  async getOpenIDConfiguration(
    env: Environment,
  ): Promise<OpenIDConfiguration | undefined> {
    const response = await fetch(env.url + '/.well-known/openid-configuration')
      .then((res) => {
        return res.json();
      })
      .catch((_) => {
        return undefined;
      });
    return response;
  }

  async getCurrentOpenIDConfiguration(): Promise<OpenIDConfiguration> {
    if (this.currentOpenIdConfiguration) {
      return this.currentOpenIdConfiguration;
    }
    const config = await this.getOpenIDConfiguration(this.env);
    this.currentOpenIdConfiguration = config;
    return config!;
  }

  updateConfigFromEnv() {
    this.config.clientId = this.env.client_id;
    this.config.issuer = this.env.url;
  }

  async _constructor() {
    this.appServerUrl = await this.mmkv.getStringAsync('server_url');
    const new_env = (await this.mmkv.getMapAsync('env')) as Environment;
    if (new_env && new_env.client_id) {
      this.env = new_env;
    }
    console.log(this.env);
    this.getCurrentOpenIDConfiguration();
    this.updateConfigFromEnv();
  }

  readyToAuthorise() {
    return this.config.clientId && this.config.clientId.length > 0;
  }

  buildAuthoriseUrl(): string {
    console.log(this.currentOpenIdConfiguration);
    return (
      this.currentOpenIdConfiguration!.authorization_endpoint +
      `?client_id=${this.config.clientId}&scope=${this.config.scopes.join(
        '%20',
      )}&response_type=code&redirect_uri=${this.config.redirectUrl}`
    );
  }

  onIdTokenReceived?: () => void;

  async onDeepLink(evt: {url: string}) {
    const _this = NhsLogin.instance;
    console.log(evt.url);
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params: any = {},
      match;
    while ((match = regex.exec(evt.url))) {
      params[match[1]] = match[2];
    }
    let {code} = params;
    if (!code || code === 'undefined' || code === _this.lastAuthorizationCode) {
      code = undefined;
      return;
    }
    _this.lastAuthorizationCode = code;
    console.log('Authorization code: ' + code);
    await _this.AuthorizationCodeExchange(code);
  }

  verifyVot(vot: string): string {
    const vots = vot.split(' ');
    if (vots.length === 0) {
      return 'No Vectors of trust';
    }
    const err = vots
      .map((v) => {
        const components = v.split('.');
        if (components.length < 2) {
          return 'Invalid vot ' + v;
        }
        return components
          .map((c, i) => {
            if (i === 0) {
              if (['P0', 'P5', 'P9'].indexOf(c) === -1) {
                return `Invalid vot ${v}. ${c} must be P0 P5 or P9`;
              }
            } else {
              if (['Cp', 'Cd', 'Ck', 'Cm'].indexOf(c) === -1) {
                return `Invalid vot ${v}. ${c} must be Cp Cd Ck or Cm`;
              }
            }
          })
          .join('');
      })
      .join('');
    if (err.length === 0) {
      this.config.vtr = `[${vots.map((v) => `"${v}"`).join(',')}]`;
    }
    return err;
  }

  idTokenDecode(idToken: string) {
    const payload = jwt_decode(idToken);
    if (!payload) {
      console.warn('No ID Token payload.');
      return;
    }
    NhsLogin.instance.nhsIdTokenPayload = payload;
    console.log(NhsLogin.instance.nhsIdTokenPayload);
  }

  async fingerprintLogin(
    webviewType: WebViewType,
    navigationContext: any,
    onComplete: () => void,
  ) {
    const authResponse = await new Fido().auth();
    const authResponseJson = JSON.parse(authResponse);
    if (authResponseJson.error) {
      Alert.alert('Fingerprint Error', authResponseJson.error, [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
      return;
    }
    const message = authResponseJson.uafProtocolMessage;
    const url =
      this.buildAuthoriseUrl() +
      '&fido_auth_response=' +
      (await new Fido().ToBase64Url(JSON.stringify(message)));
    console.log(url);
    this.openInWebview(url, webviewType, navigationContext);

    NhsLogin.instance.onIdTokenReceived = onComplete;
  }

  openInWebview(url: string, webviewType: WebViewType, navigationContext: any) {
    if (webviewType === 'browser') {
      Linking.openURL(url);
    }
    if (webviewType === 'webview') {
      navigationContext.navigate('LoginWebview', {
        url,
      });
    }
    if (webviewType === 'tab') {
      CustomTabs.openURL(url, {
        toolbarColor: Colors.Blue,
        enableDefaultShare: false,
        showPageTitle: false,
        enableUrlBarHiding: false,
      });
    }
  }

  NhsLoginAuthorise(
    webviewType: WebViewType,
    navigationContext: any,
    onComplete: () => void,
  ) {
    console.log(`Logging in with scopes: ${this.config.scopes}`);
    this.openInWebview(
      NhsLogin.instance.buildAuthoriseUrl(),
      webviewType,
      navigationContext,
    );
    NhsLogin.instance.onIdTokenReceived = onComplete;
  }

  async AuthorizationCodeExchange(authCode: string) {
    console.log('Auth code exchange');
    const nhsAuthResponse = await fetch(
      this.appServerUrl + '/token?code=' + authCode + '&env=' + this.env.name,
      {
        method: 'POST',
      },
    )
      .then(async (res) => {
        return await res.json();
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
    if (!nhsAuthResponse) {
      return;
    }
    this.idTokenDecode(nhsAuthResponse.id_token);
    this.appAccessToken = nhsAuthResponse.access_token;
    this.chatEnabled = nhsAuthResponse.messaging_enabled;
    if (nhsAuthResponse.messaging_enabled) {
      new Messaging(this.appServerUrl, this.appAccessToken);
    } else {
      this.chatDisabledMessage = nhsAuthResponse.messaging_disabled_reason;
    }
    this.nhsAccessToken = nhsAuthResponse.nhs_access_token;

    if (this.onIdTokenReceived) {
      this.onIdTokenReceived();
    } else {
      console.log('onIdTokenReceived not set');
    }
  }

  GetScopes(): {
    name: string;
    enabled: boolean;
    disabled: boolean;
  }[] {
    return possibleScopes.map((scope) => {
      return {
        name: scope,
        enabled: this.config.scopes.indexOf(scope) !== -1,
        disabled: scope === 'openid',
      };
    });
  }

  SetScopes(scopes: string[]) {
    console.log(`new scopes: ${scopes}`);
    this.config.scopes = scopes;
  }
}

new NhsLogin();
