import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  Text,
  Linking,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { NetworkContext } from "../../contexts/Networking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import { _Button } from 'react-native-elements';




export default class SignIn extends React.Component {
  static contextType = NetworkContext;

  // state to keep track of email and password data
  state = {
    username: "",
    password: "",
    rememberMe: false,
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  // Check the input before sending data to the server
  checkInput = async () => {
    // i.e. check if the email (unless using login) is valid etc
    const { username, password } = this.state;
    if (this.state.username === "" || this.state.password === "") {
      this.displayEmptyFieldsAlert();
      return;
    }
    if (this.state.rememberMe) {
      AsyncStorage.setItem("user", this.state.username);
      AsyncStorage.setItem("pw", this.state.password);
      AsyncStorage.setItem("option", "true");
    } else {
      AsyncStorage.removeItem("user");
      AsyncStorage.removeItem("pw");
      AsyncStorage.setItem("option", "false");
    }
    await this.context.signIn(username, password);
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

  async componentDidMount() {
    const username = await this.getRememberedUser();
    const password = await this.getRememberedPassword();
    const remember = await this.getRememberedOption();
    this.setState({
      username: username,
      password: password,
    });
    if (remember === "true") {
      this.setState({
        rememberMe: true,
      });
    }
    // if (username != "" && password != "" ) {
    //   this.checkInput();
    // }
  }

  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem("user");
      if (username !== null) {
        return username;
      }
    } catch (error) {}
  };

  getRememberedPassword = async () => {
    try {
      const password = await AsyncStorage.getItem("pw");
      if (password !== null) {
        return password;
      }
    } catch (error) {}
  };

  getRememberedOption = async () => {
    try {
      const option = await AsyncStorage.getItem("option");
      if (option !== null) {
        return option;
      }
    } catch (error) {}
  };

  render() {
    const { navigate } = this.props.navigation;
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

          <Text style={myStyles.baseText}>  Thrive. </Text>



          <TextInput
            style={styles.input}
            textAlign="center"
            placeholder="username"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.username}
            onChangeText={(val) => this.onChangeText("username", val)}
          />
          <TextInput
            style={styles.input}
            textAlign="center"
            placeholder="password"
            autoCapitalize="none"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(val) => this.onChangeText("password", val)}
          />
          <View style={styles.row}>

            <Pressable style={styles.button} onPress={this.checkInput}>
                 <Text style={styles.text}>Sign In</Text>
            </Pressable>

              <View style={styles.checkboxContainer}>
                <CheckBox
                  style={styles.checkbox}
                  value={this.state.rememberMe}
                  onValueChange={() =>
                    this.setState({ rememberMe: !this.state.rememberMe })
                  }
                />
                <Text style={styles.label}>Remember</Text>
              </View>
          </View>

        <View style={styles.bottom}>
            <TouchableOpacity style={styles.signUp} onPress={() => navigate("SignUp1")}>
              <LinearGradient
                colors={["transparent", "transparent"]}
                style={styles.appButtonContainer}
              >
                <Text style={styles.signInText}>Sign Up!</Text>
              </LinearGradient>
            </TouchableOpacity>

           <TouchableOpacity style={styles.forgot} onPress={() => Linking.openURL("https://thriveapp.pythonanywhere.com/api/auth/reset_password/")}>
                  <LinearGradient
                    colors={["transparent", "transparent"]}
                    style={styles.appButtonContainer}
                  >
                    <Text style={styles.signInText}>Forgot password?</Text>
                  </LinearGradient>
           </TouchableOpacity>

        </View>

        </View>
      </SafeAreaView>
     </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    marginTop: 40,
  },

  opacity:{
    marginTop: 6,
  },

  bottom:{
      marginTop: 70,
      flexDirection: "row"
  },

  signUp:{
  },

  forgot:{
    marginLeft: 60
  },

  row:{
    marginTop: 20,
    //flexDirection:"row"
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    borderColor: '#000000',
  },

  button: {

    alignItems: 'center',
    marginTop: 15,
    width: 200,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#d7e0df',

  },
  checkboxContainer: {
    flexDirection: "row",

  },
  buttoncontainer: {
    borderColor: "#000000",
    margin: 30,
    backgroundColor: "white"
  },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: "#561d70"
    },
  checkbox: {
    marginLeft: 30,
    alignSelf: "center",
  },
  label: {
    margin: 12,
  },
   linearGradient: {
      flex: 1,
      alignItems: "center",
    },
   logIn:{
    fontSize: 12,
    color: "#561d70"
   },
   signInText:{
    //marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#561d70"
   }

});



const myStyles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 60,
    textAlign: "left",
    color: "#561d70"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});