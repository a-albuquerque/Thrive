import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  _Text,
  _TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import Slider from "@react-native-community/slider";

import { NetworkContext } from "../contexts/Networking";

export default class QuestFeedbackScreen extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);

    const { answer } = this.props.route.params;
    this.state = {
      answer: answer,
      feelingRating: 5,
      questRating: 5,
      surveyAnswer: "",
    };
  }

  onValueChange = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  onSubmit = async () => {
    const { quest } = this.props.route.params;
    const { journey } = this.props.route.params;
    const { answer, feelingRating, questRating, surveyAnswer } = this.state;
    if (journey != null) {
      await this.context.completeQuest(
        journey.id,
        quest.id,
        answer,
        feelingRating,
        questRating,
        surveyAnswer
      );
    }
    this.props.navigation.navigate("Share Quest", {quest: quest, journey: journey, answer: answer});
  };

  render() {
    const { quest } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.feedbackContainer}>
          <View>
            <Text style={styles.heading2}>Good job!</Text>
            <View style={styles.line} />
            <Text style={styles.heading3}>How did you like this quest?</Text>
            <View style={styles.line2} />
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.blobContainer}>
              <Text style={styles.blobText}>
                This app is dynamic and gives different users different Quests
                and different Journey recommendations. The program becomes
                tailored to meet your individual needs and circumstances. We
                gather the information below after each quest to help us
                customize the program to you. Thank you for taking the time to
                submit it.
              </Text>
            </View>
            <View style={styles.line3} />
            <View style={styles.sliderContentBox}>
              <View style={styles.sliderTextContainer}>
                <Text style={styles.sliderText}>
                  Rate your feeling after completing the quest:{" "}
                  {this.state.feelingRating}
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={this.state.feelingRating}
                  onValueChange={(val) => {
                    this.onValueChange("feelingRating", val);
                  }}
                  minimumTrackTintColor="#C9DBC5"
                  maximumTrackTintColor="#FFFFFF"
                />
              </View>
            </View>
            <View style={styles.line3} />
            <View style={styles.sliderContentBox}>
              <View style={styles.sliderTextContainer}>
                <Text style={styles.sliderText}>
                  Rate the quest: {this.state.questRating}
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={this.state.questRating}
                  onValueChange={(val) => {
                    this.onValueChange("questRating", val);
                  }}
                  minimumTrackTintColor="#C9DBC5"
                  maximumTrackTintColor="#FFFFFF"
                />
              </View>
              <View style={styles.line3} />
            </View>
          </View>
          {quest.survey_question != "" && (
            <KeyboardAvoidingView style={styles.container3} behavior="padding">
              <Text style={styles.heading4}>{quest.survey_question}</Text>

              <View style={styles.heading4}>
                <TextInput
                  style={styles.input}
                  placeholder="type here"
                  multiline
                  scrollEnabled
                  autoCapitalize="none"
                  onChangeText={(val) => this.onChangeText("surveyAnswer", val)}
                />
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
        <View></View>

        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.journeyButton}
            onPress={this.onSubmit}
          >
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  },

  feedbackContainer: {
    flex: 10,
  },

  mainContainer: {
    flex: 2.8,
    marginTop: 15,
    alignItems: "center",
  },

  blobContainer: {
    width: "92%",
  },

  blobText: {
    fontSize: 14,
    textAlign: "center"
  },

  buttonsView: {
    flex: 1,
  },

  journeyButton: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#561d70",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 16,
  },

  heading: {
    fontSize: 24,
    color: "#918573",
  },
  heading2: {
    fontSize: 24,
    color: "#561d70",
    marginLeft: 25,
    marginTop: 16,
    textAlign: "center"
  },

  heading3: {
    fontSize: 20,
    color: "black",
    marginLeft: 25,
    marginTop: 10,
    textAlign: "center"
  },
  heading4: {
    fontSize: 15,
    color: "#561d70",
    marginLeft: 15,
    marginTop: 10,
    textAlign: "center"
  },

  line: {
    backgroundColor: "transparent",
    height: 1,
    width: "100%",
    marginTop: 8,
  },

  line2: {
    backgroundColor: "transparent",
    height: 1,
    width: "90%",
    marginLeft: 26,
    marginTop: 8,
  },
  line3: {
    backgroundColor: "transparent",
    height: 1,
    width: "90%",
    marginTop: 13,
  },
  line4: {
    backgroundColor: "transparent",
    height: 1,
    width: "90%",
    marginLeft: 18,
    marginTop: 8,
  },

  sliderContentBox: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  sliderTextContainer: {
    width: "92%",
  },
  sliderText: {
    fontSize: 14,
    textAlign: "center"
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
  },
  slider: {
    width: "90%",
    height: 40,
  },
  container3: {
    flex: 1.2,
    backgroundColor: "#F2F3F4",
  },
  input: {
    height: 30,
    width: 365,
    backgroundColor: "transparent",
    textAlign: "center"
  },
});
