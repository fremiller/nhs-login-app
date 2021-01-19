import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import * as Colors from '../../styles/colors';
import { NavBar } from "../navbar/NavBar";

import NhsLogo from "../../assets/icons/logo-nhs.svg";

import NhsLoginButton from '../../assets/img/nhs-login-button.svg'

export class WelcomeScreen extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor={Colors.Blue}></StatusBar>
                <NavBar backButtonEnabled={false} center={() => (
                    <NhsLogo height={40} width={60} fill={Colors.White}></NhsLogo>
                )} />
                <View style={styles.mainView}>
                <NhsLoginButton style={styles.nhsButton}></NhsLoginButton>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    mainView: {
        flex: 1, flexDirection: 'column-reverse',
        marginBottom: 40
    },
    nhsButton: {
        display: 'flex',
        height: 60,
        width: "100%",
        alignSelf: 'flex-end'
    }
});