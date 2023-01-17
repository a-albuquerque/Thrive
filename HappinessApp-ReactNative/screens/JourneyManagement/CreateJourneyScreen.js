// CreateJourneyScreen.js
import React from 'react'
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text, Alert
} from 'react-native'

import { NetworkContext } from '../../contexts/Networking'

const url = 'http://3.15.239.159:8000'

export default class CreateJourneyScreen extends React.Component {

  static contextType = NetworkContext

  state = {
    name: '',
    description: ''
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  createNewJourney = async () => {
    console.log("Sending new journey info")
    if (this.state.name === '' || this.state.description === '') {
      this.displayEmptyFieldsAlert()
      return
    }
    const data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.context.token
      },
      body: JSON.stringify({
        name: this.state.name,
        description: this.state.description
      })
    }
    try {
      let response = await fetch(url + '/api/journeys/', data)
      let respText = await response.json()
      this.props.navigation.goBack()
    } catch (e) {
      this.context.displayNoConnectionAlert(e)
    }
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
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Journey name'
          autoCapitalize="none"
          onChangeText={(val) => this.onChangeText('name', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Description'
          autoCapitalize="none"
           onChangeText={(val) => this.onChangeText('description', val)}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.createNewJourney}
        >
          <Text>Create new Journey</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: '85%',
    height: 55,
    backgroundColor: 'white',
    margin: 10,
    padding: 8,
    borderRadius: 14,
    color: 'green',
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: '65%',
    borderRadius: 30,
    textAlign: "center",
    backgroundColor: "#22AAAA",
  }
})
