import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { QuestListItem } from "../JourneyManagement/ManageJourneyScreen";
import DropJourneyComponent from "../DropJourney";
import { NetworkContext } from "../../contexts/Networking";
import {Ionicons} from "@expo/vector-icons";
import { Card, Title, Paragraph, Button } from "react-native-paper";

class JourneyTreeComponent extends Component {
  // Function to navigate to quest screen and hand over quest object to it
  static contextType = NetworkContext;

  state = {
    completedQuests: [],
    updated: false,
    showDrop: false,
    incompleteJourney: [],
  };

  getQuestProgress = async () => {
    const { journey } = this.props;
    const journeyProgress = await this.context.getJourneyProgress(journey.id);
    this.setState({
      completedQuests: journeyProgress.completed,
    });
  };

  startJourney = async(item) =>{
    const resp = await this.context.checkThirdJourney(this.props.journey.id);
    if (resp != null){
      this.context.activateJourney(this.props.journey.id);
      this.props.navigation.navigate("Daily");
    };

  }

  handleBackDrop = () => {
    this.setState({ showDrop: false });
  };

  componentDidMount = async () => {
    const { journey } = this.props;
    const journeyProgress = await this.context.getJourneyProgress(journey.id);
    const incomplete = await this.context.getIncompleteJourney();
    this.setState({
      completedQuests: journeyProgress.completed,
      incompleteJourney: incomplete,
    });
    this._unsubscribe = this.props.navigation.addListener("focus", () =>
      this.getQuestProgress()
    );
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  renderItem = ({ item }) => (
    <Card
      style={[
        cardStyles.cardContainer,
        this.state.completedQuests.findIndex(
          (completedQuest) => completedQuest.id === item.id
        ) != -1
          ? { backgroundColor: "#6ff2b1" }
          : { backgroundColor: "#edf7f5" },
      ]}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Title style={{ fontSize: 25, flex: 7 }}>{item.name}</Title>
          <Title style={{ fontSize: 20, flex: 1 }}>{item.difficulty} ★ </Title>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Paragraph style={{ fontWeight: "bold" }}>Estimated Time: </Paragraph>
          <Paragraph>{item.estimated_time} Minutes </Paragraph>
        </View>

        <Paragraph style={{ fontWeight: "bold" }}>Instructions:</Paragraph>
        <Paragraph numberOfLines={4}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions
        style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}
      >
        <Button
          labelStyle={{ fontSize: 16, color: "#63915e"}}
          onPress={() => this.doQuest(item)}
        >
          Start Quest
        </Button>
      </Card.Actions>
    </Card>
  );

  render() {
    const { journey } = this.props; // Get journey object from parent
    const { name, quests } = journey; // Get name and quest from journey object
    const { completedQuests } = this.state; // Get completed quests from state
    // if(this.state.showDrop){
    //   return (
    //     <DropJourneyComponent
    //       incompleteJourney={this.state.incompleteJourney}
    //       navigation={this.props.navigation}
    //       onBack={this.handleBackDrop}
    //     />
    //   );
    // }else{
      return (
      // Loop through and display each individual quest from journey object
      <SafeAreaView style={styles.container}>
      <View style={MIStyles.MIContainer}>
            <View style={MIStyles.MIPictureContainer}>
            {journey.media &&(
                <Image
                style={styles.image}
                source={{uri: 'https://thriveapp.pythonanywhere.com/'+ journey.media, }}
                />
              )}
              {journey.media == null &&(
                <Image
                style={styles.image}
                source={require('../../assets/placeholder_journey_image.png')}
                />
              )}
              {journey.video != '' && (
                <Ionicons
                style={styles.play}
                name="play-circle"
                size={50}
                onPress={()=> Linking.canOpenURL(journey.video).then(
                supported => {if (supported) {
                Linking.openURL(journey.video);
              }else{
                console.log("Couldn't load this URL")
              }})}
              />)}
            </View>
            <Text style={styles.title}>{journey.name}</Text>
            <ScrollView style={MIStyles.MITextContainer}>
                <Text style={MIStyles.MIDescriptionText}>
                    {journey.description}
                </Text>
            </ScrollView>
            {/* <FlatList
              nestedScrollEnabled
              data={journey.quests}
              keyExtractor={(item) => item.name}
              renderItem={this.renderItem}
            /> */}
          <View style={styles.buttonContainer}>
          <Button
              autoCapitalize="none"
              style={styles.button1}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={() => this.props.onBack()}>
              <Text style={styles.buttonText1}> Back</Text>
          </Button>
          <Button
              autoCapitalize="none"
              style={styles.button2}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={() => this.startJourney()}>
              <Text style={styles.buttonText2}> Start! </Text>

          </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

// Styles for button, etc.
const styles = StyleSheet.create({
  title:{
    fontSize: 25,
    color: "#561d70",
    textAlign: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
    button1:{
    marginTop: 20,
    marginBottom: 20,
    width: 150,
  },
  button2:{
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 20,
    width: 150
  },
  play:{
    opacity: 0.8,
    position: "absolute",
    top: 35,
    left: 185,
    backgroundColor: "transparent",
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 425,
    height: 150,
    resizeMode: "stretch",
  },
  journeyButton: {
    width: 200,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 30,
    borderColor: "#fff",
    alignItems: "center",
  },
  backButton: {
    width: 200,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  centerView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 9,
    flexDirection: "column",
    width: "100%",
  },
  scrollContents: {
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    color: "#561d70",
    textAlign: "center",
    fontWeight: "bold",
    margin: 15,
  },

  heading2: {
    fontSize: 16,
    color: "#561d70",
    textAlign: "center",
  },

  text: {
    fontSize: 16,
    color: "#561d70",
    textAlign: "center",
    margin: 2,
  },
});

const ButtonStyles = StyleSheet.create({
  home_primary_buttons: {
    //flex: 1,
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  no_quest_home_buttons: {
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
});

const MIStyles = StyleSheet.create({
  MIContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#edf7f5",
  },
  MITextContainer: {
    marginHorizontal: 10,
    marginBottom: 130,
    marginTop: 10,
  },
  MIDescriptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  MIPicture: {
    width: "100%",
    height: 200,
  },
  MIPictureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  MIButtonContainer: {
    // justifyContent: "center",
    marginBottom: 15,
    flex: 1,
    justifyContent: "flex-end",
  },
  MIButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "blue",
  },
});

const cardStyles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    marginHorizontal: 10,
    padding: 10,
    shadowRadius: 15,
    backgroundColor: "#edf7f5",
    elevation: 4,
    minWidth: "90%",
  },
});

export default JourneyTreeComponent;
