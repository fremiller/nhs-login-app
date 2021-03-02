import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../styles/colors';

import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import {RootStackParamList, NhsLoginInstance} from '../../App';
import { NavBar } from '../navbar/NavBar';
import { NhsButton } from '../NhsButton';
import { NhsCard } from '../NhsCard';
import { ObjectTable } from '../ObjectTable';

type OpenIDDetailsScreenNavigationProps = StackScreenProps<RootStackParamList, 'OpenidDetails'>;

export type OpenIDDetailsScreenProps = {
    navigation: OpenIDDetailsScreenNavigationProps
}

export class OpenIDDetailsScreen extends React.Component<OpenIDDetailsScreenProps, {}> {
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        });

        return (
            <Animated.View style={{opacity}}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>OpenID Details</Text>)} /></Animated.View>
        )
    }

    render() {
        return (
            <View style={styles.mainView}>
                <Text style={styles.titleText}>Userinfo response</Text>
                <ObjectTable obj={NhsLoginInstance.nhsUserInfo}></ObjectTable>
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
    titleText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: Colors.TextColor
    },
    mainView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        marginBottom: 40,
        marginHorizontal: 20,
    }
});