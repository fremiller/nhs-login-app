import React from 'react';
import { Animated, ListRenderItem, ListRenderItemInfo, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavBar } from '../navbar/NavBar';

import * as Colors from '../../styles/colors';
import { FlatList } from 'react-native-gesture-handler';

import { CheckBoxListItem } from '../CheckboxListItem';

import {NhsLogin} from '../NhsLogin';
import { StackHeaderProps, StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import {RootStackParamList, NhsLoginInstance} from '../../services';

type OpenidSettingsScreenNavigationProp = StackScreenProps<RootStackParamList, 'OpenidSettings'>;

export type OpenidSettingsScreenProps = {
    navigation: OpenidSettingsScreenNavigationProp
}

export interface OpenidSettingsScreenState {
    scopes: { name: string, enabled: boolean, disabled: boolean }[]
}

export class OpenidSettingsScreen extends React.Component<OpenidSettingsScreenProps, OpenidSettingsScreenState> {
    constructor(props: OpenidSettingsScreenProps){
        super(props);
        this.state = {
            scopes: NhsLoginInstance.GetScopes()
        } 
    }

    static header(props: StackHeaderProps) {
        const progress = Animated.add(props.scene.progress.current, props.scene.progress.next || 0);

        const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        });

        return (
            <Animated.View style={{opacity}}><StatusBar backgroundColor={Colors.Blue}></StatusBar>
            <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Scopes</Text>)} /></Animated.View>
        )
    }

    render() {
        return (
            <View style={styles.root}>
                <FlatList data={this.state.scopes} renderItem={(props) => this.scopeListRenderItem(props, this)}
                    keyExtractor={(item) => item.name}>

                </FlatList>
            </View>
        )
    }

    scopeListRenderItem(props: ListRenderItemInfo<{name: string, enabled: boolean, disabled: boolean}>, el: any): React.ReactElement {
        let index = props.index;
        return (
            <CheckBoxListItem onChange={(enabled) => {
                let foo = [...this.state.scopes];
                foo[index].enabled = enabled
                this.setState({
                    scopes: foo
                });
                NhsLoginInstance.SetScopes(this.state.scopes.filter((scope)=>scope.enabled).map((scope)=>scope.name));
            }} title={props.item.name} checked={props.item.enabled} disabled={props.item.disabled}></CheckBoxListItem>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
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