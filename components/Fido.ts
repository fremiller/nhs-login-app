import {NhsLogin} from './NhsLogin';

import ReactNative, {Alert} from 'react-native';

const {FidoUAF} = ReactNative.NativeModules;

export class Fido {
  async register(accessToken: string) {
    const result: string = await FidoUAF.FidoUafRegister({
      accessToken: accessToken,
      url: NhsLogin.instance.currentOpenIdConfiguration!
        .fido_uaf_registration_request_endpoint,
    });
    const resultJson = JSON.parse(result);
    if (resultJson.error) {
      Alert.alert('Fingerprint Error', resultJson.error, [
        {
          text: 'Cancel',
          onPress: () => undefined,
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {},
        },
      ]);
      return;
    }
    console.log(resultJson);
    const res = await fetch(
      NhsLogin.instance.currentOpenIdConfiguration!
        .fido_uaf_registration_response_endpoint,
      {
        method: 'POST',
        body: resultJson,
      },
    )
      .then((_res) => _res.json())
      .catch((err) => {
        console.log(err);
      });
    console.log(res);

    const username = await FidoUAF.GetUsername({});
    await NhsLogin.instance.saveFidoUsername(username);
  }

  async auth(): Promise<string> {
    const username = await NhsLogin.instance.getFidoUsername();
    const result: string = await FidoUAF.FidoUafAuthenticate({
      url: NhsLogin.instance.currentOpenIdConfiguration!
        .fido_uaf_authentication_request_endpoint,
      username,
    });

    return result;
  }

  async ToBase64Url(s: string): Promise<string> {
    return await FidoUAF.ToBase64Url({
      input: s,
    });
  }
}
