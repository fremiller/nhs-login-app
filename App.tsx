/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {WelcomeScreen} from './components/screens/WelcomeScreen';

const Stack = createStackNavigator();


declare const global: {HermesInternal: null | {}};

export default class App extends React.Component {
  render() {return (
    <>
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Welcome" component={WelcomeScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
  }
}

