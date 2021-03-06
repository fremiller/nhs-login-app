import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";

import {components} from "../styles/components";

//@ts-ignore
import Chevron from "../assets/img/dropdown-chevron.svg";

export interface NhsDropdownProps {
    items: {
        label: string,
        value: string
    }[]
    currentValue?: string,
    onValueChanged: (value: string) => void;
}

export interface NhsDropdownState {
    displayModal: boolean
}

export class NhsDropdown extends React.Component<NhsDropdownProps, NhsDropdownState> {
    constructor(props: NhsDropdownProps){
        super(props);
        
        this.state = {
            displayModal: false
        }
    }

    render() {
        return (
            <>
            <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    displayModal: true
                })
            }}><View style={components.picker}><Text style={components.pickerText}>{this.props.items.find((v) => v.value == this.props.currentValue)?.label}</Text><Chevron height="40%" width="10%"></Chevron></View></TouchableWithoutFeedback>
            <Modal animationType="fade" transparent={true} visible={this.state.displayModal} onRequestClose={() =>{
                this.setState({
                    displayModal: false
                })
            }}>
                {/* <View style={styles.bgButton}>
                    <TouchableWithoutFeedback style={styles.bgButtonButton} onPress={() => {
                        console.log("hi")
                        this.setState({
                            displayModal: false
                        })
                    }}></TouchableWithoutFeedback>
                </View> */}
                <TouchableWithoutFeedback onPress={() => {
                        console.log("hi")
                        this.setState({
                            displayModal: false
                        })
                    }}>
                    <View style={styles.centredView} >
                        <View style={styles.modalView}>
                            {this.props.items.map((v, i) => {
                                return (
                                    <TouchableOpacity style={styles.modalItems} key={v.value} onPress={() => {
                                        console.log("foo")
                                        this.props.onValueChanged(v.value);
                                        this.setState({
                                            displayModal: false
                                        })
                                    }}><Text style={styles.modalText}>{v.label}</Text></TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            </>
        )
    }
}

const styles = StyleSheet.create({
    bgButton: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -2,
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        left: 0,
        top: 0,
        // backgroundColor: "black"
    },
    bgButtonButton: {
        width: "100%",
        height: "100%",
        display: "flex"
    },
    centredView: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    },
    modalView: {
        margin: 30,
        backgroundColor: "#ffffff",
        padding: 30,
        borderRadius: 3,
    },
    modalItems: {
        padding: 8
    },
    modalText: {
        fontSize: 21
    }
});