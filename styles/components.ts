import { StyleSheet } from "react-native";
import * as Colors from "./colors";

export const components = StyleSheet.create({
    textField: {
        borderColor: Colors.FormBorderColor,
        borderWidth: 3,
        backgroundColor: Colors.White,
        fontSize: 21,
        paddingVertical: 3,
        paddingHorizontal: 5
    }
});