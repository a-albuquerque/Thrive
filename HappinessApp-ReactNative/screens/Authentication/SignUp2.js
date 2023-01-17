// SignUp2.js
import React from "react";
import {
  View,
  _Button,
  _Text,
  _TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

import { NetworkContext } from "../../contexts/Networking";
import { BarPasswordStrengthDisplay } from "react-native-password-strength-meter";
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';


export default class SignUp2 extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);

    const { email, firstName, lastName } = this.props.route.params;
    this.state = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      username: "",
      password: "",
      age: -1,
      sex: "",
      displaySexInputWarning: false, // display text above input if
      // wrong character was entered
      displayAgeInputWarning: false, // display text above input if
      // age entered is invalid (less then 0...)
      displayShortAlert: false,
      registerSuccess: "",
    };
  }

  onSetSex = (val) => {
    if (val !== "M" && val !== "F") {
      this.setState({
        displaySexInputWarning: true,
        sex: val,
      });
    } else {
      this.setState({
        displaySexInputWarning: false,
        sex: val,
      });
    }
  };

  onSetAge = (val) => {
    const intAge = parseInt(val, 10);

    if (!intAge || intAge < 0) {
      this.setState({
        displayAgeInputWarning: true,
        age: intAge,
      });
    } else {
      this.setState({
        displayAgeInputWarning: false,
        age: intAge,
      });
    }
  };

  onChangeText = (key, val) => {
    if (key === "sex") {
      this.onSetSex(val);
    } else if (key === "age") {
      this.onSetAge(val);
    } else {
      this.setState({ [key]: val });
    }
  };

  onChange = (password) => this.setState({ password });

  // Check if email is correct format
  // check if phone number is correct format
  // etc
  checkNewUserData = async () => {
    const { username, firstName, lastName, password, email, age, sex } =
      this.state;

    if (username === "" || password === "" || age === "" || sex === "") {
      this.displayEmptyFieldsAlert();
      return;
    }
    const nameRegex = new RegExp(/^(?=.*\d)(?=.*[a-z]).{8,}$/);

    if (!nameRegex.test(password)) {
      this.displayShortAlert();
      return;
    }

    await this.context.signUp(
      username,
      password,
      email,
      firstName,
      lastName,
      age,
      sex
    );

    this.setState({
      registerSuccess: this.context.registerSuccess,
    });

    if (this.state.registerSuccess === "t") {
      this.props.navigation.navigate("LogIn", {
        username: this.state.username,
        password: "",
      });
    }
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

  displayShortAlert = () => {
    Alert.alert(
      "Password strength is too weak",
      "Password must contain: \n -At least 8 characters\n -At least 1 number\n -At least 1 lowercase character",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  render() {
    const { password } = this.state;
    return (
      <LinearGradient
                  colors={["#cef5ef", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  locations={[0, 0.6, 0.75, 0.9]}
                  style={styles.linearGradient}
      >
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            label='username'
            onChangeText={(val) => this.onChangeText('username', val)}
          />
          <TextInput
            style={styles.input}
            label='password'
            secureTextEntry={true}
            onChangeText={(val) => this.onChangeText('password', val)}
          />
          <View style={styles.pwcontainer}>
            <BarPasswordStrengthDisplay password={password}/>
          </View>

          {this.state.displayAgeInputWarning && (
            <Text style={{ color: "red" }}>
              Please make sure to enter a positive number for the age
            </Text>
          )}
          <View style={styles.bottom}>
          <TextInput
            style={styles.age}
            placeholder="Age"
            autoCapitalize="none"
            onChangeText={(val) => this.onChangeText("age", val)}
          />
          {this.state.displaySexInputWarning && (
            <Text style={{ color: "red" }}>
              Please make sure to enter either M, or F
            </Text>
          )}
          <TextInput
            style={styles.sex}
            placeholder="Sex M/F"
            onChangeText={(val) => this.onChangeText("sex", val)}
          />
          </View>
          <Button
            autoCapitalize="none"
            style={styles.button}
            title='continue'
            mode="contained"
            // dark='true'
            onPress={this.checkNewUserData}>
            <Text style={styles.buttonText}> Sign Up! </Text>
            </Button>
        </View>
      </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 60,
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 40,
  },
  button:{
    marginTop: 80,
    width: 200
  },
  buttonText:{
    color: "white",
  },
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  age: {
    backgroundColor: 'transparent',
  },
  sex: {
    marginLeft: 60,
    backgroundColor: 'transparent'
  },
  bottom:{
    marginTop: 30,
    flexDirection: "row"
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  pwcontainer: {
    flex: 1,
    alignItems: "center",
    color: 'transparent',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
});
