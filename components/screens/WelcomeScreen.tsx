import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';

import * as Colors from '../../styles/colors';
import { NavBar } from "../navbar/NavBar";

//@ts-ignore
import NhsLogo from "../../assets/icons/logo-nhs.svg";

import * as RootNavigation from '../RootNavigation';
import { NhsLogin } from '../NhsLogin';
import { NhsLoginButton } from '../NhsLoginButton';
import {NhsButton} from '../NhsButton';
import { TextInput } from 'react-native-gesture-handler';

import {RootStackParamList} from '../../App';
import { StackScreenProps } from '@react-navigation/stack';


type WelcomeScreenNavigationProp = StackScreenProps<RootStackParamList, 'Welcome'>;

export type WelcomeScreenProps = {
    navigation: WelcomeScreenNavigationProp
}

export interface WelcomeScreenState {
    loading: boolean
}

const loginManager = new NhsLogin();

export class WelcomeScreen extends React.Component<WelcomeScreenProps, WelcomeScreenState> {
    constructor(props: WelcomeScreenProps){
        super(props);
        this.state = {
            loading: false
        }
    }
    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor={Colors.Blue}></StatusBar>
                <NavBar backButtonEnabled={false} center={() => (
                    <View accessibilityRole="header" accessibilityLabel="Nhs Login App Welcome Screen">
                        <NhsLogo height={40} width={60} fill={Colors.White}></NhsLogo>
                    </View>
                )} />
                {(!this.state.loading)?
                <View style={styles.mainView}>
                    <NhsLoginButton onPress={async () => {
                        this.setState({loading: true});
                        await loginManager.NhsLoginAuthorise();
                        this.setState({loading: false});
                    }}></NhsLoginButton>
                    <NhsButton onPress={()=>{
                        this.props.navigation.navigate('OpenidSettings', {
                            loginManager: loginManager
                        });
                    }} text="Modify Scopes" style="secondary"></NhsButton>
                    <NhsButton onPress={()=>{}} text="Clear Login Data" style="secondary"></NhsButton>
                </View>:<View style={styles.mainView}><ActivityIndicator size='large' color="#0000ff"></ActivityIndicator></View>}
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