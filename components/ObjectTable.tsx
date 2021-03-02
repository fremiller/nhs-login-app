import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface ObjectTableProps {
    obj: any
}

export class ObjectTable extends React.Component<ObjectTableProps, {}>{
    render() {
        if (!this.props.obj) {
            return (
                <View><Text>undefined</Text></View>
            )
        }
        return (
          <View style={styles.root}>
              {Object.keys(this.props.obj).map((key)=> {
                  return (
                      <View>
                    <Text key={key} style={styles.key}>{key}</Text>
                  {typeof this.props.obj[key] == "object" ? <ObjectTable obj={this.props.obj[key]}></ObjectTable> : <Text>{this.props.obj[key]}</Text>}
                  </View>
                  )
              })}
          </View>  
        );
    }
}

const styles = StyleSheet.create({
    root: {
        marginLeft: 10
    },
    key: {
        fontWeight: "bold"
    },
    value: {

    }
})