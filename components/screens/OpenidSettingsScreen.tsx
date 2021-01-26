import React from 'react';
import { ListRenderItem, ListRenderItemInfo, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavBar } from '../navbar/NavBar';

import * as Colors from '../../styles/colors';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';

import { CheckBoxListItem } from '../CheckboxListItem';

import {NhsLogin} from '../NhsLogin';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import {RootStackParamList} from '../../App';

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
        this.state ={
            scopes: props.route.params.loginManager.GetScopes()
        } 
    }

    render() {
        return (
            <View style={styles.root}>
                <StatusBar backgroundColor={Colors.Blue}></StatusBar>
                <NavBar backButtonEnabled={true} left={() => (<Text style={styles.title}>Scopes</Text>)} />

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
                el.props.route.params.loginManager.SetScopes(this.state.scopes.filter((scope)=>scope.enabled).map((scope)=>scope.name));
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