import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  Linking,
} from "react-native";
import { NetworkContext } from "../../contexts/Networking";

export default class ForgotPassword extends React.Component {
  static contextType = NetworkContext;

  // state to keep track of email
  state = {
    email: "",
    emailSubmitted: false,
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  // Check the input before sending data to the server
  checkInput = () => {
    const { email } = this.state;
    if (email === "") {
      this.displayEmptyFieldsAlert();
      return;
    }
    this.context.forgotPassword(email);
    this.setState({
      emailSubmitted: true,
    });
  };

  displayEmptyFieldsAlert = () => {
    Alert.alert(
      "Empty input",
      "Please make sure to fill all required fields.",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  render() {
    if (this.state.emailSubmitted)
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>
              Check email inbox for password information
            </Text>
          </View>
        </SafeAreaView>
      );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#BADEDE"
            onChangeText={(val) => this.onChangeText("email", val)}
          />
          <Button
            style={styles.button}
            title="Submit"
            onPress={this.checkInput}
          />
          <Text
            style={{ color: "blue" }}
            onPress={() =>
              Linking.openURL(
                "http://192.168.0.128:8050/api/auth/reset_password/"
              )
            }
          >
            Click Here to Reset Password
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "green",
    fontWeight: "500",
  },
  input: {
    width: "90%",
    fontSize: 18,
    fontWeight: "500",
    height: 55,
    backgroundColor: "white",
    color: "green",
    margin: 10,
    padding: 8,
    borderRadius: 14,
  },

  container: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },

  button: {
    fontSize: 14,
    color: "#f194ff",
    fontFamily: "Comfortaa",
    letterSpacing: -0.015,
    width: "90%",
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "pink",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
});
