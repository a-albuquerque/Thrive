import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View, Button, Linking } from "react-native";

export default class Authentication extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 16,
        }}
      >
        <Text style={styles.Heading}> Happiness App</Text>
        <Button
          style={styles.button}
          title="LogIn"
          onPress={() => navigate("LogIn")}
        />
        <Button
          style={styles.button}
          title="SignUp"
          onPress={() => navigate("SignUp1")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: "#C9DBC5",
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
  },

  Heading: {
    fontSize: 36,
    color: "#918573",
    textAlign: "center",
    margin: 10,
    letterSpacing: -0.015,
  },
});
