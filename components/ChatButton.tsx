import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ChatInfo } from "./Messaging";

import * as Colors from "../styles/colors";

export interface ChatButtonProps {
    name: string,
    location: string,
    imageSrc: string,
    id: string,
    light?: boolean
    onPress: (chat: ChatInfo) => void;
}
export interface ChatButtonState {}

export class ChatButton extends React.Component<ChatButtonProps, ChatButtonState>{
    render(){
        return (
            <TouchableOpacity style={styles.root} onPress={() => {
                this.props.onPress({
                    gp: {
                        name: this.props.name,
                        id: this.props.id,
                        image: this.props.imageSrc,
                        location: this.props.location
                    }
                })
            }}>
                <Image style={styles.roundImage} source={{uri: this.props.imageSrc}}></Image>
                    <View style={styles.details}>
                    <Text style={{...styles.title, color: this.props.light ? Colors.White : Colors.TextColor}}>{this.props.name}</Text>
                    <Text style={{...styles.subtitle, color: this.props.light ? Colors.White : Colors.TextColor}}>{this.props.location}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "row",
        alignItems: "center"
    },
    light: {
        color: Colors.White
    },
    title: {
        fontSize: 19,
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 19
    },
    roundImage: {
        width: 46,
        height: 46,
        borderRadius: 23
    },
    details: {
        marginLeft: 5
    }
})