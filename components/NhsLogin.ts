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

    async NhsLoginAuthorise() {
        console.log(`Logging in with scopes: ${this.config.scopes}`);
        let result = await authorize(this.config).catch((e) => {
            console.log(e);
        });
        if (!result){
            return;
        }
        console.log(`Authorization code: ${result.authorizationCode}`);
        await this.AuthorizationCodeExchange(result.authorizationCode);
    }

    async AuthorizationCodeExchange(authCode: string){

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
