import React, { useState } from "react";
import {
  View,
  StyleSheet,
  _TextInput,
  _Button,
  Alert,
  SafeAreaView,
  _Text,
  CheckBox,
  Linking,
} from "react-native";
import { NetworkContext } from "../contexts/Networking";
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';

//import { Button } from "react-native-paper";

export default class addBuddy extends React.Component {
  static contextType = NetworkContext;
  // state to keep track of email and password data
  state = {
    buddy: "",
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  // Check the input before sending data to the server
  checkInput = () => {
    // i.e. check if the email (unless using login) is valid etc
    const { buddy } = this.state;
    if (this.state.buddy === "") {
      this.displayEmptyFieldsAlert();
      return;
    }
    this.context.sendBuddyRequest(buddy);
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

  handleRandomRequest = async () => {
    this.context.sendRandomNonBuddyRequest()
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <LinearGradient
          colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6, 0.75, 0.9]}
          style={styles.linearGradient}
      >
      <SafeAreaView style={styles.container}>


        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="username of accountability buddy"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#561d70"
            value={this.state.buddy}
            onChangeText={(val) => this.onChangeText("buddy", val)}
          />

          <Button
            autoCapitalize="none"
            style={styles.button1}
            title='continue'
            mode="contained"
            // dark='true'
            onPress={this.checkInput}>
            <Text style={styles.buttonText1}> Send Accountability Buddy Request </Text>

          </Button>
          <Button
            autoCapitalize="none"
            style={styles.button2}
            title='continue'
            mode="contained"
            // dark='true'
            onPress={this.handleRandomRequest}>
            <Text style={styles.buttonText2}> Send a Random Buddy Request </Text>
         </Button>

        </View>
      </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    width: "90%",
    fontSize: 18,
    fontWeight: "500",
    height: 55,
    backgroundColor: "transparent",
    color: "green",
    // margin: 10,
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
    buttonContainer: {
  },
    button1:{
    marginTop: 20,
    marginBottom: 20,
    width: 350,
  },
  button2:{
    marginTop: 20,
    marginBottom: 20,
    width: 350
  },
  button3:{
    marginVertical: 10,
    width: "70%",
    alignSelf: "center",
    position: "absolute",
    bottom: 10
  },
  buttonText1:{
    color: "white",
    fontSize: 14
  },
  buttonText2:{
    color: "white",
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14
  },
  buttonText3:{
    color: "white",
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15
  },

  button: {
    // fontSize: 14,
    // color: "#f194ff",
    // fontFamily: "Comfortaa",
    // letterSpacing: -0.015,
    width: "90%",
    // marginRight: 40,
    // marginLeft: 40,
    marginTop: 30,
    // paddingTop: 10,
    // paddingBottom: 10,
    // backgroundColor: "pink",
    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#fff",
    // alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  buttoncontainer: {
    margin: 30,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    fontWeight: "bold",
  },
});
