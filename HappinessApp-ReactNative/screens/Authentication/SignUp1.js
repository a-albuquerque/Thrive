// SignUp1.js
import React from 'react'
import {
  View,
  _Button,
  _TextInput,
  StyleSheet,
  SafeAreaView, Alert
} from 'react-native'
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import {NetworkContext} from '../../contexts/Networking'



export default class SignUp1 extends React.Component {
  
  static contextType = NetworkContext
  state = {
    firstName: '',
    lastName: '',
    email: '',
  }
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  // Check if email is correct format
  // check if phone number is correct format
  checkNewUserData = () => {
    const { firstName, lastName, email } = this.state

    if (firstName === '' || lastName === '' || email === '') {
      this.displayEmptyFieldsAlert()
      return
    }
    this.props.navigation.navigate('SignUp2', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    })
  }

  displayEmptyFieldsAlert = () => {
    Alert.alert(
      "Empty input",
      "Please make sure to fill all required fields.",
      [
        {
          text: "Close",
          style: "cancel"
        }
      ]
    );
  }

  render() {
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
            label='first name'
            onChangeText={val => this.onChangeText('firstName', val)}
          />
          <TextInput
            style={styles.input}
            label='last name'
            onChangeText={val => this.onChangeText('lastName', val)}
          />
          <TextInput
            style={styles.input}
            label='email'
            autoCapitalize="none"
            onChangeText={val => this.onChangeText('email', val)}
          />
          <Button
          autoCapitalize="none"
          style={styles.button}
          title='continue'
          mode="contained"
          // dark='true'
          onPress={this.checkNewUserData}>
          <Text style={styles.buttonText}> continue </Text>
          </Button>
        </View>
      </SafeAreaView>
      </LinearGradient>
    )
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
  container: {
    flex: 1,
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  }
})