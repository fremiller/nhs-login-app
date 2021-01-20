import React from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity, ViewStyle, GestureResponderEvent } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import * as Colors from '../styles/colors';

type NhsButtonStyle = 'primary' | 'secondary';

export interface NhsButtonProps {
    style: NhsButtonStyle,
    text: string,
    onPress: (event: GestureResponderEvent) => void;
}

export class NhsButton extends React.Component<NhsButtonProps> {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles(this.props.style).container}>
                    <View style={styles(this.props.style).front}>
                        <View style={styles(this.props.style).behind}></View>
                    </View>
                    <View style={styles(this.props.style).button}>
                        <Text style={styles(this.props.style).buttonText}>{this.props.text}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const SHADOW_HEIGHT = 4;
const HEIGHT = 53;
const BORDER_RADIUS = 4;

function styles(buttonStyle: NhsButtonStyle): any {
    return StyleSheet.create({
        container: {
            height: HEIGHT + SHADOW_HEIGHT,
            marginTop: 5,
            // flex: 1,
            alignItems: 'center'
        },
        button: {
            width: "100%",
            height: HEIGHT,
            textTransform: 'none',
            backgroundColor: buttonStyle == 'primary' ? Colors.ButtonColor : Colors.SecondaryButtonColor,
            padding: 14,
            borderRadius: BORDER_RADIUS,
        },
        front: {
            width: "100%",
            height: HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
            position: 'absolute',
            left: 0,
            top: 0,
            
        },
        behind: {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            width: "100%",
            height: HEIGHT + SHADOW_HEIGHT,
            backgroundColor: "#111",
            zIndex: 3,
            borderRadius: BORDER_RADIUS
        },
        buttonText: {
            textAlign: 'center',
            color: Colors.ButtonTextColor,
            fontSize: 19,
            fontWeight: 'bold'
        }
    })
}
