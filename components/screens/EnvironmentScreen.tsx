import React from 'react';
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import * as Colors from '../../styles/colors';
import {NavBar} from '../navbar/NavBar';

//@ts-ignore
import NhsLogo from '../../assets/icons/logo-nhs.svg';

import * as RootNavigation from '../RootNavigation';
import {Environment, NhsLogin} from '../NhsLogin';
import {NhsLoginButton} from '../NhsLoginButton';
import {NhsButton} from '../NhsButton';

import {RootStackParamList} from '../../services';
import {StackHeaderProps, StackScreenProps} from '@react-navigation/stack';
import {components} from '../../styles/components';
import {NhsCard} from '../NhsCard';
import {TouchableOpacity} from 'react-native-gesture-handler';

type EnvironmentScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  'Environment'
>;

export type EnvironmentScreenProps = EnvironmentScreenNavigationProp & {};

export interface EnvironmentScreenState {
  loading: boolean;
  url?: string;
  urlInput: string;
  errorText?: string;
  environments: Environment[];
}

export class EnvironmentScreen extends React.Component<
  EnvironmentScreenProps,
  EnvironmentScreenState
> {
  constructor(props: EnvironmentScreenProps) {
    super(props);
    this.state = {
      loading: false,
      url: undefined,
      urlInput: NhsLogin.instance.appServerUrl,
      errorText: undefined,
      environments: [],
    };
  }
  static header(props: StackHeaderProps) {
    const progress = Animated.add(
      props.scene.progress.current,
      props.scene.progress.next || 0,
    );

    const opacity = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View style={{opacity}}>
        <StatusBar backgroundColor={Colors.Blue} />
        <NavBar
          backButtonEnabled={true}
          left={() => <Text style={styles.title}>Environment</Text>}
        />
      </Animated.View>
    );
  }

  async fetchEnvironments(url: string) {
    const envURL = url + '/env';
    const response = await fetch(envURL, {
      method: 'GET',
    })
      .then((res) => res.json())
      .catch((err) => {
        this.setState({
          errorText: 'Failed to connect to server.\n' + err.toString(),
          loading: false,
        });
      });
    console.log(response);
    if (!response) {
      return;
    }
    this.setState({
      loading: false,
      environments: response.envs,
    });
  }

  async onConnectButtonPressed(_this: this) {
    _this.setState({url: _this.state.urlInput, loading: true});
    await _this.fetchEnvironments(_this.state.urlInput);
    _this.setState({loading: false});
  }

  async onEnvButtonPressed(_this: this, index: number) {
    // if (!this.state.url || !this.state.environments || this.state.environments.length >= index){
    //     return;
    // }
    this.setState({
      loading: true,
    });
    console.log(this.state.urlInput, this.state.environments[index]);
    await NhsLogin.instance.updateEnvironment(
      this.state.urlInput,
      this.state.environments[index],
    );
    this.props.navigation.navigate('Welcome');
  }

  render() {
    const _this = this;
    return (
      <View style={styles.mainView}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            display: !this.state.loading ? 'none' : undefined,
          }}
        />
        {this.state.errorText ? (
          <NhsCard title="Error" body={this.state.errorText} />
        ) : undefined}

        {this.state.environments.length > 0 ? (
          <View>
            <Text style={styles.titleText}>Select Environment</Text>
            <Text style={styles.text}>
              Environment not listed? Each environment requires configuration on
              the server.
            </Text>
            {this.state.environments.map((env: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.envButton}
                  onPress={() => this.onEnvButtonPressed(this, index)}>
                  <Text style={styles.envTitle}>{env.name}</Text>
                  <Text style={styles.envUrl}>{env.url}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : undefined}
        <View
          style={{
            display: this.state.environments.length > 0 ? 'none' : 'flex',
          }}>
          <NhsCard
            title="Server Configuration"
            body="Download the server from https://github.com/fishfred/nhs-login-app-server"
          />
          <Text style={styles.label}>App Server URL</Text>
          <TextInput
            keyboardType="url"
            style={components.textField}
            onChangeText={(text) => {
              this.setState({urlInput: text});
            }}
            value={this.state.urlInput}
          />
          <NhsButton
            text="Connect"
            onPress={() => this.onConnectButtonPressed(this)}
            style="primary"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  label: {
    fontSize: 21,
    marginTop: 5,
    marginBottom: 3,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.White,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.Black,
  },
  text: {
    fontSize: 21,
    color: Colors.Black,
  },
  mainView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 40,
    marginHorizontal: 20,
    backgroundColor: Colors.BackgroundColor,
  },
  envTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  envUrl: {
    fontSize: 15,
  },
  envButton: {
    marginLeft: 10,
  },
});
