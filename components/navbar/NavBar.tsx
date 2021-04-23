import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import * as Colors from '../../styles/colors';

//@ts-ignore
import BackArrow from '../../assets/icons/icon-chevron-left.svg';

import * as RootNavigation from '../RootNavigation';

interface NavBarProps {
  center?(): JSX.Element;
  left?(): JSX.Element;
  backButtonEnabled: boolean;
}

export class NavBar extends React.Component<NavBarProps> {
  render() {
    return (
      <View style={styles.root}>
        {this.props.backButtonEnabled ? (
          <Pressable
            accessibilityLabel="Back Button"
            accessibilityRole="button"
            onPress={() => {
              RootNavigation.goBack();
            }}>
            <BackArrow width={40} height={40} fill={Colors.White} />
          </Pressable>
        ) : undefined}
        {this.props.center && (
          <View style={styles.center}>{this.props.center()}</View>
        )}
        {this.props.left && (
          <View style={styles.left}>{this.props.left()}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: Colors.Blue,
    minHeight: 60,
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  left: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
