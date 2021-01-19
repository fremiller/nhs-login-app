import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Colors from '../../styles/colors';

import BackArrow from '../../assets/icons/icon-chevron-left.svg';

interface NavBarProps {
    center(): JSX.Element,
    backButtonEnabled: boolean
}

export class NavBar extends React.Component<NavBarProps> {

    render() {
        return (
            <View style={styles.root}>
                {this.props.backButtonEnabled ? <BackArrow width={40} height={40} fill={Colors.White}></BackArrow> : undefined}
                <View style={styles.center}>
                    {this.props.center()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        backgroundColor: Colors.Blue,
        minHeight: 60,
        alignItems: 'center'
    },
    button: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0
    },
})