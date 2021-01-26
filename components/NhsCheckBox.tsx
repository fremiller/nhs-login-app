import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//@ts-ignore
import CheckMark from '../assets/icons/checkbox.svg';
import * as Colors from '../styles/colors';

export interface NhsCheckBoxState {
    disabled: boolean,
    value: boolean
}

export class NhsCheckBox extends React.Component<NhsCheckBoxState> {
    render() {
        return (
            <View style={styles.box}>
                {this.props.value ? <CheckMark></CheckMark> : undefined}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        borderColor: Colors.FormBorderColor,
        borderWidth: 2,
        height: 40,
        width: 40,
        marginRight: 10
    }
});