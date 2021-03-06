import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../styles/colors';

import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import {RootStackParamList} from '../../services';
import { NavBar } from '../navbar/NavBar';
import { NhsButton } from '../NhsButton';
import { NhsCard } from '../NhsCard';

type DashboardScreenNavigationProps = StackScreenProps<RootStackParamList, 'Dashboard'>;

export type DashboardScreenProps = DashboardScreenNavigationProps & {};

export class DashboardScreen extends React.Component<DashboardScreenProps, {}> {
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        });

        return (
            <Animated.View style={{opacity}}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Chats</Text>)} /></Animated.View>
        )
    }

    render() {
        return (
            <View style={styles.mainView}>
                <NhsCard title="Chat Disabled" body="Chat functionality has been disabled on the app server."></NhsCard>
                <NhsButton text="OpenID Details" style="primary" onPress={() => {
                    this.props.navigation.navigate("OpenidDetails");
                }}></NhsButton>
                <NhsButton text="Set up fingerprint" style="primary" onPress={() => {

                }}></NhsButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.BackgroundColor
    },
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        color: Colors.White,
        marginLeft: 10
    },
    mainView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginBottom: 40,
        marginHorizontal: 20,
    }
});