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
import { DashboardScreen } from './components/screens/DashboardScreen';

import { navigationRef } from "./components/RootNavigation";
import { OpenidSettingsScreen } from './components/screens/OpenidSettingsScreen';
import { NhsLogin } from './components/NhsLogin';

export type RootStackParamList = {
  OpenidSettings: {loginManager: NhsLogin},
  Welcome: undefined,
  Dashboard: undefined
}

const Stack = createStackNavigator<RootStackParamList>();


declare const global: {HermesInternal: null | {}};

export default class App extends React.Component {
  render() {return (
    <>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Welcome" component={WelcomeScreen}></Stack.Screen>
        <Stack.Screen name="Dashboard" component={DashboardScreen}></Stack.Screen>
        <Stack.Screen name="OpenidSettings" component={OpenidSettingsScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
  }
}

