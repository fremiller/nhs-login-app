import React from 'react';
import { ActivityIndicator, Alert, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

import * as Colors from '../../styles/colors';
import { NavBar } from "../navbar/NavBar";

//@ts-ignore
import NhsLogo from "../../assets/icons/logo-nhs.svg";

import { NhsLogin } from '../NhsLogin';
import { NhsLoginButton } from '../NhsLoginButton';
import { NhsButton } from '../NhsButton';
import {NhsDropdown} from '../NhsDropdown';

import { RootStackParamList } from '../../services';
import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';

import { components } from '../../styles/components';


type WelcomeScreenNavigationProp = StackScreenProps<RootStackParamList, 'Welcome'>;

export type WelcomeScreenProps = WelcomeScreenNavigationProp & {};

export interface WelcomeScreenState {
    loading: boolean,
    selectedWebview: string
}

export class WelcomeScreen extends React.Component<WelcomeScreenProps, WelcomeScreenState> {
    constructor(props: WelcomeScreenProps) {
        super(props);
        this.state = {
            loading: false,
            selectedWebview: "tab"
        }
    }
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 1, 0],
        });

        return (<Animated.View style={{ opacity }}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={false} center={() => (
                <View accessibilityRole="header" accessibilityLabel="Nhs Login App Welcome Screen">
                    <NhsLogo height={40} width={60} fill={Colors.White}></NhsLogo>
                </View>
            )} /></Animated.View>)
    }

    async onLoginButtonPressed() {
        if (!NhsLogin.instance.readyToAuthorise()) {
            this.setState({ loading: false });
            Alert.alert("Cannot sign in", "You must select an environment before continuing",
                [
                    {
                        text: "Cancel",
                        onPress: () => undefined,
                        style: "cancel"
                    },
                    {
                        text: "Continue",
                        onPress: () => this.props.navigation.navigate("Environment")
                    }
                ])
                return;
        }
        const _this = this;
        // this.setState({ loading: true });
        //@ts-ignore
        NhsLogin.instance.NhsLoginAuthorise(this.state.selectedWebview,  this.props.navigation, () => {
            _this.props.navigation.navigate('Dashboard');
        });
        // this.setState({ loading: false });
        
    }

    render() {
        return (
            <View style={styles.root}>

                {(!this.state.loading) ?
                    <View style={styles.mainView}>
                        <NhsLoginButton onPress={async () => {
                            await this.onLoginButtonPressed()
                        }}></NhsLoginButton>
                        <NhsButton onPress={() => {
                            const _this = this;
                            //@ts-ignore
                            NhsLogin.instance.fingerprintLogin(this.state.selectedWebview, this.props.navigation, () => {
                                _this.props.navigation.navigate('Dashboard');
                            });
                        }} text="Log in with fingerprint" style="primary"></NhsButton>
                        <NhsButton onPress={() => {
                            this.props.navigation.navigate('OpenidSettings');
                        }} text="Modify Scopes" style="secondary"></NhsButton>
                        <NhsButton onPress={() => { }} text="Clear Login Data" style="secondary"></NhsButton>
                        <NhsButton onPress={() => {
                            this.props.navigation.navigate('Environment');
                        }} text="Change Environment" style="secondary"></NhsButton>
                        <NhsDropdown currentValue={this.state.selectedWebview} onValueChanged={(v) => this.setState({selectedWebview: v})} items={[
                            {
                                label: "Web Browser",
                                value: "browser"
                            },
                            {
                                label: "System Webview",
                                value: "webview"
                            },
                            {
                                label: "Custom Tab",
                                value: "tab"
                            }
                        ]}></NhsDropdown>
                        <Text style={components.label}>Webview</Text>
                        {/* <ChatButton></ChatButton> */}
                    </View> : <View style={styles.mainView}><ActivityIndicator size='large' color="#0000ff"></ActivityIndicator></View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    mainView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column-reverse',
        marginBottom: 40,
        marginHorizontal: 20,
    }
});