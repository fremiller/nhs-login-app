import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Message, DisplayMessage} from './Messaging';
import * as Colors from '../styles/colors';

export interface ChatMessageProps {
  message: DisplayMessage;
}

export class ChatMessage extends React.Component<ChatMessageProps, {}> {
  render() {
    return (
      <View
        style={{
          ...styles.chatMessageContainer,
          flexDirection: this.props.message.gp ? 'row-reverse' : 'row',
        }}>
        <View style={styles.padding} />
        <View
          style={
            this.props.message.gp
              ? {...styles.chatMessageBox, ...styles.chatMessageBoxGp}
              : {...styles.chatMessageBox, ...styles.chatMessageBoxPatient}
          }>
          <Text
            style={
              this.props.message.gp
                ? styles.chatMessageTextGp
                : styles.chatMessageTextPatient
            }>
            {this.props.message.data}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatMessageContainer: {
    display: 'flex',
  },
  padding: {
    width: '100%',
    flexShrink: 1,
  },
  chatMessageBox: {
    paddingVertical: 7,
    marginVertical: 3,
    flexShrink: 0,
    paddingHorizontal: 30,
    borderRadius: 300,
  },
  chatMessageBoxPatient: {
    backgroundColor: Colors.Green,
    borderBottomRightRadius: 3,
  },
  chatMessageBoxGp: {
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderBottomLeftRadius: 3,
  },
  chatMessageTextPatient: {
    fontSize: 20,
    color: Colors.White,
  },
  chatMessageTextGp: {
    fontSize: 20,
  },
});
