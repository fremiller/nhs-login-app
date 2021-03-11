import React from 'react';

import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
//@ts-ignore
import NhsLoginButtonSvg from '../assets/img/nhs-login-button.svg'

interface NhsLoginButtonProps {
    onPress? : ((event: GestureResponderEvent) => void);
    loading?: boolean;
}

export class NhsLoginButton extends React.Component<NhsLoginButtonProps> {
    render() {
        return (<TouchableOpacity style={{...styles.nhsButton, marginTop: 10}} onPress={this.props.onPress} accessibilityLabel="Continue with NHS Login" accessibilityRole="button">
            <View style={styles.nhsButton}>
            <NhsLoginButtonSvg style={styles.nhsButton}></NhsLoginButtonSvg>
            </View>
        </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    nhsButton: {
        display: 'flex',
        height: 60,
        width: '100%',
        alignSelf: 'flex-end',
    }
})