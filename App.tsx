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

import * as Colors from './styles/colors';
import { OpenIDDetailsScreen } from './components/screens/OpenidDetails';
import { EnvironmentScreen } from './components/screens/EnvironmentScreen';

import {RootStackParamList} from './services';

const Stack = createStackNavigator<RootStackParamList>();

declare const global: {HermesInternal: null | {}};

export default class App extends React.Component {
  render() {return (
    <>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="float" screenOptions={{
        headerTintColor: Colors.Blue,
        headerStyle: {
          backgroundColor: Colors.Blue
        }
      }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
          header: WelcomeScreen.header,
        }}></Stack.Screen>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{
          header: DashboardScreen.header,
        }}></Stack.Screen>
        <Stack.Screen name="OpenidSettings" component={OpenidSettingsScreen} options={{
          header: OpenidSettingsScreen.header,
        }}></Stack.Screen>
        <Stack.Screen name="OpenidDetails" component={OpenIDDetailsScreen} options={{
          header: OpenIDDetailsScreen.header,
        }}></Stack.Screen>
        <Stack.Screen name="Environment" component={EnvironmentScreen} options={{
          header: EnvironmentScreen.header,
        }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
  }
}

