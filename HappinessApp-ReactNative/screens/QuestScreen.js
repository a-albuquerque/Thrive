import "react-native-gesture-handler";
import React from "react";
import {Ionicons} from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from "react-native";

import * as Linking from 'expo-linking';

import {Button} from 'react-native-paper';

export default class QuestScreen extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      answer: "",
      textBoxFlexValue: 1.25
    };
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { quest } = this.props.route.params;
    const{ journey } = this.props.route.params;

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.view1}>
        {quest.media && (
            <Image
            style={styles.image}
            source={{uri: 'https://thriveapp.pythonanywhere.com/'+ quest.media, }}
            />
          )}
          {quest.media == null && (journey == null || journey.media == null) &&(
            <Image
            style={styles.image}
            source={require('../assets/placeholder_journey_image.png')}
            />
          )}
          {quest.media == null && journey && journey.media &&(
            <Image
              style={styles.image}
              source={{uri: 'https://thriveapp.pythonanywhere.com/'+ journey.media, }}
            />
          )}
          {quest.video != '' && quest.video !== undefined && (
            <Ionicons
            style={styles.play}
            name="play-circle"
            size={50}
            onPress={()=> {

              Linking.openURL(quest.video);
              
              // Linking.canOpenURL(quest.video).then(
              // supported => {if (supported) {
              //   Linking.openURL(quest.video);
              // }else{
                
              //   Alert.alert("Error", "Couldn't load this URL. Device might not be supported", [
              //     {
              //       text: "Close",
              //       style: "cancel",
              //     },
              //   ]);
                
              //   console.log("Couldn't load this URL")
              // }})
            }}
            />
        )}
        </View>
        <View style={styles.view2}>
          <ScrollView persistentScrollbar={true}>
            <Text style={styles.heading2}>{quest.name} Quest</Text>
            <View style={styles.line} />
            <Text style={styles.heading3}> Directions </Text>
            <View style={styles.line2} />

            <Text style={styles.heading3}>{quest.description}</Text>
            
          </ScrollView>
        </View>
        
        <View style={[styles.view2, {flex: this.state.textBoxFlexValue}]}>
          <TextInput
                style={[styles.input, {backgroundColor: "rgb(255, 255, 255)", borderWidth: 0.75, borderRadius: 10}]}
                multiline
                placeholder="Enter your response here."
                autoCapitalize="none"
                onChangeText={(val) => this.onChangeText("answer", val)}
                onFocus={()=> {
                  this.setState({...this.state, textBoxFlexValue: 2})
                }}
                onBlur={()=> {
                  this.setState({...this.state, textBoxFlexValue: 1.25})
                }}
              />
        </View>
        

        <View style={styles.buttonsView}>
             <Button
              autoCapitalize="none"
              style={styles.submitButton}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={() => {
              this.props.navigation.navigate("Feedback", {
                answer: this.state.answer,
                quest: quest,
                journey: journey,
              });
              }}>
              <Text style={styles.submitButtonText}> Submit </Text>
             </Button>
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsView:{
    // flex: 0.5,
    backgroundColor: "#edf7f5",
    paddingBottom: 10
  },
  submitButton:{
    // marginTop: 50,
    // marginVertical: 10,
    width: "70%",
    alignSelf: "center",
    // bottom: 10,
    borderRadius: 50
  },
  submitButtonText:{
    color: "white",
    fontSize: 15
  },
  play:{
    opacity: 0.8,
    position: "absolute",
    top: 35,
    left: 185,
    backgroundColor: "transparent",
    color: '#b4d6c5',
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  view1: {
    flex: 1.3,
    flexDirection: "row",
  },
  image: {
    width: 425,
    height: 150,
    resizeMode: "stretch",
  },
  view2: {
    flex: 5,
    backgroundColor: "#edf7f5",
    borderTopRightRadius: 23,
    borderTopLeftRadius: 23,
  },


  journeyButton: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },

  heading: {
    fontSize: 24,
    color: "#918573",
    textAlign: "center"
    //fontFamily: "Comfortaa-Regular"
  },
  heading2: {
    fontSize: 20,
    color: "#561d70",
    //fontFamily: "Comfortaa-Regular"
    marginLeft: 25,
    marginTop: 16,
    textAlign: "center"
  },

  heading3: {
    fontSize: 14,
    color: "#27214D",
    //fontFamily: "Comfortaa-Regular"
    marginLeft: 25,
    marginTop: 16,
  },

  question_body: {
    fontSize: 14,
    color: "#27214D",
    marginLeft: 25,
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    margin: 10,
    padding: 8,
    color: "#918573",
    fontSize: 14,
    textAlignVertical: "top",
  },

  line: {
    backgroundColor: "#F3F3F3",
    height: 1,
    marginTop: 8,
  },

  line2: {
    backgroundColor: "transparent",
    height: 1,
    width: 100,
    marginLeft: 26,
    marginTop: 8,
  },
});
