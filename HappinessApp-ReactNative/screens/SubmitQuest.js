import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  View,
  _Text,
  Image,
  SafeAreaView, _TextInput, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NetworkContext } from "../contexts/Networking";

export default class SubmitQuest extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props)

    this.state = {
      journey_name: "",
      journey_description: "",
      email: "",
      name: "",
      only_quest: false,
      quests: [],
      q1: {},
      q2: {},
      q3: {},
      alert: 0,
    }
  }

  onValueChange = (key, val) => {
    this.setState({
      [key]: val,
    })
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  questOnChangeText = (key, value, dict) => {
    dict[key] = value;
  }

  addQuest = (dict) => {
    this.state.quests.push(dict);
  }

  onSubmit = async() => {
    if (this.state.journey_name === "" || this.state.journey_description === ""){
      this.state.only_quest = true
    }
    this.state.quests = []
    this.addQuest(this.state.q1)
    this.addQuest(this.state.q2)
    this.addQuest(this.state.q3)
    const { journey_name, journey_description, email, name, only_quest, quests} = this.state
    if (only_quest){
      await this.context.submitQuest(quests, name, email);
      this.state.alert = 0
      this.props.navigation.navigate("Home")
    }
    else{
      await this.context.uploadJourney(journey_name, journey_description, quests, email, name);
      this.state.alert = 0
      this.props.navigation.navigate("Home")
    }
  }

  displayInstructionAlert = () => {
    Alert.alert("Create your own journeys and quests!", "You can submit journeys and quests you design here! " +
        "Your suggested quests and journeys will be evaluated by admin, and they will contact you if needed.", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  render() {
    if (this.state.alert === 0){
      this.displayInstructionAlert()
      this.state.alert += 1;
    }
    return(
      <LinearGradient
          colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6, 0.75, 0.9]}
          style={styles.linearGradient}
      >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Journey Name"
              autoCapitalize = "none"
              onChangeText={val => this.onChangeText('journey_name', val)}
            />
            <TextInput
                style={styles.input}
                placeholder="Journey Description"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.onChangeText('journey_description', val)}
            />
            <Text style={styles.heading1}>For a quest on its own, leave above blank.</Text>
            <Text style={styles.heading2}>    </Text>
            <Text style={styles.heading3}>Quest 1</Text>
            <TextInput
                style={styles.input}
                placeholder="Quest Name*"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('name', val, this.state.q1)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Description*"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('description', val, this.state.q1)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Order (if in a journey)"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('order', parseInt(val), this.state.q1)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Survey Question"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('survey_question', val, this.state.q1)}
            />
            <Text style={styles.heading3}>Quest 2</Text>
            <TextInput
                style={styles.input}
                placeholder="Quest Name"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('name', val, this.state.q2)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Description"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('description', val, this.state.q2)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Order (if in a journey)"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('order', parseInt(val), this.state.q2)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Survey Question"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('survey_question', val, this.state.q2)}
            />
            <Text style={styles.heading3}>Quest 3</Text>
            <TextInput
                style={styles.input}
                placeholder="Quest Name"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('name', val, this.state.q3)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Description"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('description', val, this.state.q3)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Order (if in a journey)"
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('order', parseInt(val), this.state.q3)}
            />
            <TextInput
                style={styles.input}
                placeholder="Quest Survey Question"
                multiline
                autoCapitalize = "none"
                onChangeText={val => this.questOnChangeText('survey_question', val, this.state.q3)}
            />
            <Text style={styles.heading3}>Your Info</Text>
            <TextInput
                style={styles.input}
                placeholder="Your Name*"
                autoCapitalize = "none"
                onChangeText={val => this.onChangeText('name', val)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email*"
                autoCapitalize = "none"
                onChangeText={val => this.onChangeText('email', val)}
            />
          </View>
          <View style={styles.buttonsView}>
             <Button
              autoCapitalize="none"
              style={styles.submitButton}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={this.onSubmit}>
              <Text style={styles.submitButtonText}> Submit </Text>
             </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      </LinearGradient>
    );
  }
}

class Tree extends React.Component {
  render() {
    // The tree is different depending on whihc level the user is at
    const { navigate } = this.props.navigation;
    return (      
      <Image style={styles.image} source={require("../assets/tree2.png")} />
   );
  }
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  submitButton:{
    marginTop: 50,
    marginVertical: 10,
    width: "70%",
    alignSelf: "center",
    bottom: 10,
    borderRadius: 50
  },
  submitButtonText:{
    color: "white",
    fontSize: 15
  },
  container: {
    flex: 1,
    alignItems: "flex-start"
  },

  greenline: {
    backgroundColor: "#BADEDE",
    height: 10,
    width: '100%',
    position: 'absolute'

  },

  journeyButton: {
    width: 200,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#C9DBC5",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent:"center",
    alignSelf: "center",
    marginBottom: 25
  },

  Heading: {
    fontSize: 10,
    color: "#27214D",
    textAlign: "justify",
    margin: 20,
  },

  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
  },

  heading: {
    fontSize: 14,
    color: "#27214D",
    padding: 5,
    marginTop: 25,
    marginLeft: 3,
    textAlign: "left",
    alignSelf: "center",
    textAlign: "center"
  },

  heading1: {
    fontSize: 14,
    color: "#27214D",
    padding: 5,

    marginLeft: 3,
    textAlign: "center",
    alignSelf: "center",
    textAlign: "center"
  },

  heading2: {
    fontSize: 14,
    color: "#27214D",
    //padding: 5,
    marginLeft: 3,
    textAlign: "left",
    alignSelf: "center",
    //marginTop: 25
  },

  heading3: {
    fontSize: 16,
    color: "#27214D",
    padding: 5,
    marginTop: 30,
    marginLeft: 3,
    textAlign: "left",
    alignSelf: "flex-start"
  },

  input: {
    marginLeft: 0,
    width: 300,
    height: 30,
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center"
  }
});
