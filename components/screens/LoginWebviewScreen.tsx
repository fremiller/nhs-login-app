import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../styles/colors';

import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import {RootStackParamList, NhsLoginInstance} from '../../services';
import { NavBar } from '../navbar/NavBar';
import { NhsButton } from '../NhsButton';
import { NhsCard } from '../NhsCard';
import { ObjectTable } from '../ObjectTable';
import WebView from 'react-native-webview';

type LoginWebviewScreenNavigationProps = StackScreenProps<RootStackParamList, 'LoginWebview'>;

export type LoginWebviewScreenProps = LoginWebviewScreenNavigationProps & {
    url: string
}

export class LoginWebviewScreen extends React.Component<LoginWebviewScreenProps, {}> {
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        });

        return (
            <Animated.View style={{opacity}}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Log In</Text>)} /></Animated.View>
        )
    }

    render() {
        return (
            <WebView style={{width: "100%", height: "100%"}} source={{ uri: this.props.route.params.url}}></WebView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        color: Colors.White,
        marginLeft: 10
    },
});