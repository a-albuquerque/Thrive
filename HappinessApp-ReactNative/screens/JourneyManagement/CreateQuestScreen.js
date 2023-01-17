import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  View,
  ScrollView, Alert,
} from "react-native";
import {NetworkContext} from "../../contexts/Networking";

const url = 'http://3.15.239.159:8000'

export default class CreateQuestScreen extends React.Component {

  static contextType = NetworkContext

  constructor(props) {
    super(props);
    this.state = {
      // selectedJourneys: this.props.route.params.journeys,
      // journeys: [],
      journey: this.props.route.params.journey,
      name: '',
      description: ''
    }
    console.log(this.state)
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  createQuest = async() => {
    const { journey } = this.state
    const journeyId = journey.id

    if (this.state.name === '' || this.state.description === '') {
      this.displayEmptyFieldsAlert()
      return
    }
    // if (selectedJourneys.length <= 0) {
    //   this.displayNoJourneysSelectedAlert()
    //   return
    // }

    // Creating new Quest
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
      console.log(url + '/api/journeys/' + journeyId + '/quests/')
      let fetchResponse = await fetch(url + '/api/journeys/' +
        journeyId + '/quests/', data)
      const quest = await fetchResponse.json()

      console.log("Quest:", quest)

      this.props.navigation.goBack()
    } catch (e) {
      console.log(e)
      this.context.displayNoConnectionAlert(e)
    }
  }

  // UNUSED
  // Was used for choosing to which journeys add the new quest
  // Current design: quest can be a part of only one journey
  getJourneys = async () => {
    console.log("Beginning journeys fetch")
    try {
      let fetchResponse = await fetch(url + '/api/journeys/', {
        method: 'GET',
        headers: {
          'Authorization': 'Token ' + this.context.token
        },
      })
      let respJson = await fetchResponse.json()

      this.setState({
        journeys: respJson
      })
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

  // UNUSED
  // Was used for choosing to which journeys add the new quest
  // Current design: quest can be a part of only one journey
  displayNoJourneysSelectedAlert = () => {
    Alert.alert(
      "No journeys selected",
      "Please make sure select at least one journey.",
      [
        {
          text: "Close",
          style: "cancel"
        }
      ]
    );
  }

  // UNUSED
  // Was used for choosing to which journeys add the new quest
  // Current design: quest can be a part of only one journey
  isJourneySelected = (journeyToCheck) => {
    for (let journey of this.state.selectedJourneys) {
      if (journey.id === journeyToCheck.id)
        return true
    }

    return false
  }


  // UNUSED
  // Was used for choosing to which journeys add the new quest
  // Current design: quest can be a part of only one journey
  onToggleJourney = (journey) => {

    if(this.isJourneySelected(journey)) {
      // Deselect
      let updatedList = []
      for (let listJourney of this.state.selectedJourneys) {
        if (journey.id === listJourney.id)
          continue

        updatedList.push(listJourney)
      }
      this.setState({
        selectedJourneys: updatedList
      })
    } else {
      // Select
      const updatedList = [...this.state.selectedJourneys, journey]
      this.setState({
        selectedJourneys: updatedList
      })
    }
  }

  // UNUSED
  // Was used for getting journeys list journeys for selection during creation
  // Current design: quest can be a part of only one journey
  componentDidMount() {
    // this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //   this.getJourneys()
    // })
  }

  componentWillUnmount() {
    // this._unsubscribe()
  }

  render() {
    const { journeys } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Quest name'
          autoCapitalize="none"
          onChangeText={(val) => this.onChangeText('name', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Description'
          autoCapitalize="none"
           onChangeText={(val) => this.onChangeText('description', val)}
        />
        <View style={styles.bottomButtonContainer} >
          <TouchableOpacity
            style={styles.button}
            onPress={this.createQuest}
          >
            <Text>Create new Quest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

class JourneyListItem extends React.Component {

  onToggle = () => {
    this.props.onToggleJourney(this.props.journeyInfo)
  }

  render() {
    const { name, description } = this.props.journeyInfo
    const { journeyInfo, isSelected } = this.props
    const journeySelected = isSelected(journeyInfo)

    return(
      <TouchableOpacity
        style={ (journeySelected) ?
          styles.journeyListSelected :
          styles.journeyListDeselected
        }
        onPress={this.onToggle}
      >
        <Text>{name}: {description}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#918573",
  },
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
  bottomButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  button: {
    width: '50%',
    height: 50,
    marginTop: 7,
    backgroundColor: "#22AAAA",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 9,
    flexDirection: 'column',
    width: '100%',
  },
  scrollContents: {
    flexGrow: 1,
    alignItems: 'center'
  },
  journeyListSelected: {
    width: '85%',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 7,
    backgroundColor: "#62c84e",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyListDeselected: {
    width: '85%',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 7,
    backgroundColor: "#d1ddcf",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});
