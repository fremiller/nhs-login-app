import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View, TextInput } from 'react-native';

import * as Colors from '../../styles/colors';
import { NavBar } from "../navbar/NavBar";

//@ts-ignore
import NhsLogo from "../../assets/icons/logo-nhs.svg";

import * as RootNavigation from '../RootNavigation';
import { NhsLogin } from '../NhsLogin';
import { NhsLoginButton } from '../NhsLoginButton';
import { NhsButton } from '../NhsButton';

import { RootStackParamList, NhsLoginInstance } from '../../App';
import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import { components } from '../../styles/components';
import { NhsCard } from '../NhsCard';
import { TouchableOpacity } from 'react-native-gesture-handler';


type EnvironmentScreenNavigationProp = StackScreenProps<RootStackParamList, 'Environment'>;

export type EnvironmentScreenProps = EnvironmentScreenNavigationProp & {};

export interface EnvironmentScreenState {
    loading: boolean,
    url?: string,
    urlInput: string,
    errorText?: string,
    environments: any
}

const loginManager = new NhsLogin();

export class EnvironmentScreen extends React.Component<EnvironmentScreenProps, EnvironmentScreenState> {
    constructor(props: EnvironmentScreenProps) {
        super(props);
        this.state = {
            loading: false,
            url: undefined,
            urlInput: NhsLoginInstance.appServerUrl,
            errorText: undefined,
            environments: undefined
        }
    }
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 1, 0],
        });

        return (
            <Animated.View style={{ opacity }}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
                <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Environment</Text>)} /></Animated.View>
        )
    }

    async fetchEnvironments(url: string) {
        const envURL = url + "/env";
        const response = await fetch(envURL, {
            method: "GET"
        }).then((res)=>res.json())
        .catch((err) => {
            this.setState({
                errorText: "Failed to connect to server.\n" + err.toString(),
                loading: false
            });
        });
        console.log(response);
        if (!response) {
            return;
        }
        this.setState({
            loading: false,
            environments: response.envs
        })
    }

    render() {
        const _this = this;
        return (
            <View style={styles.mainView}>
                {this.state.loading ? <ActivityIndicator size='large' color="#0000ff"></ActivityIndicator> : <>
                    {this.state.errorText ? <NhsCard title="Error" body={this.state.errorText}></NhsCard> : undefined}
                    {this.state.environments ? <> 
                        <Text style={styles.titleText}>Select Environment</Text>
                        <Text style={styles.text}>Environment not listed? Each environment requires configuration on the server.</Text>
                        {this.state.environments.map((env: any, index: number) => {
                            return <TouchableOpacity key={index} style={styles.envButton}>
                            <Text style={styles.envTitle}>{env.name}</Text>
                            <Text style={styles.envUrl}>{env.url}</Text>
                            </TouchableOpacity>
                        })}
                    </> : // !this.state.environments
                    <>
                    <NhsCard title="Server Configuration" body="Download the server from https://github.com/fishfred/nhs-login-app-server"></NhsCard>
                    <Text style={styles.label}>App Server URL</Text>
                    <TextInput style={components.textField} onChangeText={(text) => {
                        this.setState({ urlInput: text })
                    }} value={this.state.urlInput}></TextInput>
                    <NhsButton text="Connect" onPress={async () => {
                        _this.setState({ url: this.state.urlInput, loading: true });
                        await _this.fetchEnvironments(this.state.urlInput);
                        _this.setState({ loading: false });
                    }} style="primary"></NhsButton>
                    </>
    }
                </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    label: {
        fontSize: 21,
        marginTop: 5,
        marginBottom: 3
    },
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        color: Colors.White,
        marginLeft: 10
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
        backgroundColor: Colors.BackgroundColor
    },
    envTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    envUrl: {
        fontSize: 15
    },
    envButton: {
        marginLeft: 10
    }
});