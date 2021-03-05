import React from 'react';
import { ActivityIndicator, Alert, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

import * as Colors from '../../styles/colors';
import { NavBar } from "../navbar/NavBar";

//@ts-ignore
import NhsLogo from "../../assets/icons/logo-nhs.svg";

import * as RootNavigation from '../RootNavigation';
import { NhsLogin } from '../NhsLogin';
import { NhsLoginButton } from '../NhsLoginButton';
import { NhsButton } from '../NhsButton';
import { TextInput } from 'react-native-gesture-handler';

import { RootStackParamList, NhsLoginInstance } from '../../services';
import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';


type WelcomeScreenNavigationProp = StackScreenProps<RootStackParamList, 'Welcome'>;

export type WelcomeScreenProps = WelcomeScreenNavigationProp & {};

export interface WelcomeScreenState {
    loading: boolean
}

export class WelcomeScreen extends React.Component<WelcomeScreenProps, WelcomeScreenState> {
    constructor(props: WelcomeScreenProps) {
        super(props);
        this.state = {
            loading: false
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
        if (!NhsLoginInstance.readyToAuthorise()) {
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
        NhsLogin.instance.NhsLoginAuthorise(() => {
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
                            this.props.navigation.navigate('OpenidSettings');
                        }} text="Modify Scopes" style="secondary"></NhsButton>
                        <NhsButton onPress={() => { }} text="Clear Login Data" style="secondary"></NhsButton>
                        <NhsButton onPress={() => {
                            this.props.navigation.navigate('Environment');
                        }} text="Change Environment" style="secondary"></NhsButton>
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