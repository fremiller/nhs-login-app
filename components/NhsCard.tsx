import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Colors from '../styles/colors';

export interface NhsCardProps {
  title: string;
  body: string;
}

export class NhsCard extends React.Component<NhsCardProps, {}> {
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.body}>{this.props.body}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  body: {
    color: Colors.TextColor,
    fontSize: 18,
  },
});
