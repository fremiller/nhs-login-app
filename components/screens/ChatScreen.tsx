import React from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../styles/colors';

import { StackHeaderProps, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../services';
import { NavBar } from '../navbar/NavBar';
import { NhsButton } from '../NhsButton';
import { NhsCard } from '../NhsCard';
import { ObjectTable } from '../ObjectTable';
import { NhsLogin } from '../NhsLogin';
import { TextInput } from 'react-native-gesture-handler';
import { components } from '../../styles/components';
import { ChatInfo, Messaging } from '../Messaging';
import { ChatButton } from '../ChatButton';

type ChatScreenNavigationProps = StackScreenProps<RootStackParamList, 'Chat'>;

export type ChatScreenProps = ChatScreenNavigationProps & {
    chat: ChatInfo
}

export interface ChatScreenState {
    currentText: string
}

export class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 1, 0],
        });
        //@ts-ignore
        const chat = props.scene.route.params.chat as ChatInfo;
        return (
            <Animated.View style={{ opacity }}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
                <NavBar backButtonEnabled={true} left={() => (<ChatButton imageSrc={chat.gp.image} name={chat.gp.name} location={chat.gp.location}></ChatButton>)} /></Animated.View>
        )
    }

    currentChat: ChatInfo;

    constructor(props: ChatScreenProps) {
        super(props);
        this.currentChat = props.chat;
        this.state = {
            currentText: ""
        }
    }

    render() {
        const _this = this;
        return (
            <View style={styles.mainView}>
                <View style={styles.submitRow}>
                    <TextInput style={{ ...components.textField, ...styles.submitText }} value={this.state.currentText} onChangeText={(text) => { this.setState({ currentText: text }) }}></TextInput>
                    <View style={styles.submitButton}>
                        <NhsButton style='primary' text="Send" onPress={() => {
                            Messaging.instance.sendTextMessage(this.props.route.params.chat.gp.id, _this.state.currentText);
                            _this.setState({
                                currentText: ""
                            });
                        }} disableMargin={true}></NhsButton>
                    </View>
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
    submitButton: {
        flexShrink: 0,
        width: 85,
        margin: 0,
        padding: 0
    },
    submitText: {
        width: "100%",
        flexShrink: 1,
        marginRight: 5,
        height: 55
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