import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { onChange } from 'react-native-reanimated';
import { NhsCheckBox } from './NhsCheckBox';

export interface CheckBoxListItemProps {
    title: string;
    checked: boolean;
    disabled: boolean;
    onChange: (checked: boolean) => void
}


export class CheckBoxListItem extends React.Component<CheckBoxListItemProps> {
    render() {
        return (
            <TouchableWithoutFeedback accessible={true}
                accessibilityRole="checkbox"
                accessibilityLabel={"scope " + this.props.title}
                // accessibilityHint={`Toggles the scope ${this.props.title}`}
                accessibilityState={{ checked: this.props.checked, disabled: this.props.disabled }}
                disabled={this.props.disabled}
                style={[style.view, { opacity: this.props.disabled ? 0.4 : 1 }]}
                onPress={() => {
                    this.props.onChange(!this.props.checked);
                }}>
                <NhsCheckBox value={this.props.checked} disabled={this.props.disabled}></NhsCheckBox><Text style={style.text}>{this.props.title}</Text>
            </TouchableWithoutFeedback>
        )
    }
}

const style = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        paddingLeft: 30
    },
    checkbox: {
        marginRight: 10,
        width: 25,
        height: 25
    },
    text: {
        fontSize: 20
    }
})