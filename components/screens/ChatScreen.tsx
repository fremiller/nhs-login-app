import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../styles/colors';

import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import {RootStackParamList} from '../../services';
import { NavBar } from '../navbar/NavBar';
import { NhsButton } from '../NhsButton';
import { NhsCard } from '../NhsCard';
import { ObjectTable } from '../ObjectTable';
import { NhsLogin } from '../NhsLogin';
import { TextInput } from 'react-native-gesture-handler';
import { components } from '../../styles/components';
import { ChatInfo } from '../Messaging';

type ChatScreenNavigationProps = StackScreenProps<RootStackParamList, 'Chat'>;

export type ChatScreenProps = ChatScreenNavigationProps & {
    chat: ChatInfo
}

export class ChatScreen extends React.Component<ChatScreenProps, {}> {
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        });
        console.log(props.scene.route.params);
        return (
            <Animated.View style={{opacity}}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Chat</Text>)} /></Animated.View>
        )
    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={styles.submitRow}>
                    <TextInput style={components.textField}></TextInput>
                    <NhsButton style='primary' text="Send" onPress={() => {}}></NhsButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.BackgroundColor
    },
    submitRow: {
        flexDirection: 'row'
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
        flexDirection: 'column-reverse',
        marginBottom: 40,
        marginHorizontal: 20,
    }
});