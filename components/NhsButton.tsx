import React from 'react';
import { Button, StyleSheet, View, Text, TouchableWithoutFeedback, ViewStyle, GestureResponderEvent } from 'react-native';
import * as Colors from '../styles/colors';

import {SetScopes} from './NhsLogin';

type NhsButtonStyle = 'primary' | 'secondary';

export interface NhsButtonProps {
    style: NhsButtonStyle,
    text: string,
    onPress: (event: GestureResponderEvent) => void;
}

interface NhsButtonState {
    currentlyPressed: boolean;
}

export class NhsButton extends React.Component<NhsButtonProps, NhsButtonState> {
    constructor(props: NhsButtonProps){
        super(props);
        this.state = {
            currentlyPressed: false
        }
    }

    onPressIn(){
        this.setState({
            currentlyPressed: true
        });
    }

    onPressOut(){
        setTimeout(() => {
            this.setState({
                currentlyPressed: false
            });
        }, 200);
    }

    render() {
        return (
            <TouchableWithoutFeedback accessibilityLabel={this.props.text} accessibilityRole="button" onPress={this.props.onPress} onPressIn={() => this.onPressIn()} onPressOut={() => this.onPressOut()}>
                <View style={styles(this.props.style, this.state.currentlyPressed).container}>
                    <View style={[styles(this.props.style, this.state.currentlyPressed).front]}>
                        <View style={styles(this.props.style, this.state.currentlyPressed).behind}></View>
                    </View>
                    <View style={styles(this.props.style, this.state.currentlyPressed).button}>
                        <Text style={styles(this.props.style, this.state.currentlyPressed).buttonText}>{this.props.text}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const SHADOW_HEIGHT = 4;
const HEIGHT = 53;
const BORDER_RADIUS = 4;

function styles(buttonStyle: NhsButtonStyle, currentlyPressed: boolean): any {
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
            marginTop: currentlyPressed ? SHADOW_HEIGHT : 0
        },
        front: {
            width: "100%",
            height: HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
            position: 'absolute',
            left: 0,
            top: 0
        },
        behind: {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            width: "100%",
            marginTop: SHADOW_HEIGHT,
            height: HEIGHT,
            backgroundColor: "#414141",
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
