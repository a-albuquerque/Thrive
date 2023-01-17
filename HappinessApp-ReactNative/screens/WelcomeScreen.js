import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { NetworkContext } from "../contexts/Networking";

export default class WelcomeScreen extends React.Component {
  state = {
    dailyReport: false,
  };
  render() {
    const { dailyReport } = this.state;
    return (
      <SafeAreaView style={styles.background}>
        {!dailyReport ? (
          // Welcome message
          <View>
            <Text style={styles.regularText}>
              Hey, you’re awake! It’s winter and cold as sh*t outside but I’m
              glad you’re up so early (time of day). You haven’t been on the app
              in a while(streak), good to see you back.
            </Text>
            <Text>{"\n"}</Text>
            <Text style={styles.regularText}>
              Are you feeling overwhelmed? A good method is find your{" "}
              <Text style={styles.boldText}>happy place</Text>, go to it, and
              re-center yourself.
            </Text>
            <Text>{"\n"}</Text>
            <Text style={styles.regularText}>
              <Text style={styles.boldText}>Ray</Text> was journalling about his{" "}
              <Text style={styles.boldText}>happy place</Text>, he commented:
              “I’m really bad at Valorant Victor please carry me.”
            </Text>

            <Text>{"\n"}</Text>
            <Text style={styles.regularText}>
              <Text style={styles.boldText}>Robbie’s </Text>(accountability
              buddy) been trying to reach you, best{" "}
              <Text style={styles.boldText}>
                let him know how you’re doing.
              </Text>
            </Text>

            <Text>{"\n"}</Text>
            <Text style={styles.regularText}>
              “Every morning we are born again. What we do today is what matters
              most.” – Buddha
            </Text>
            <Button
              onPress={() => this.setState({ dailyReport: true })}
              title="Continue"
              color="#841584"
            />
          </View>
        ) : (
          // Daily Report
          <View style={styles.scrollView}>
            <ScrollView contentContainerStyle={styles.scrollContents}>
              <View style={styles.dailyHeader}>
                <Text>Daily Report</Text>
              </View>
              <View style={styles.dailyReport}>
                <Text>Good Morning</Text>
                <Text>{"\n\n\n"}</Text>
                <Text>Your current progress on the _ Journey is</Text>
                <Text>{"\n\n\n\n\n"}</Text>
                <Text>Calendar</Text>
                <Text>{"\n\n\n\n\n\n\n\n\n"}</Text>
                <Text>Comment #1</Text>
                <Text>{"\n\n\n"}</Text>
                <Text>What would you like to do now? *Dropdown*</Text>
                <Button
                  onPress={() => this.props.finishWelcome()}
                  title="Continue"
                  color="#841584"
                />
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B1235",
  },
  regularText: {
    fontSize: 18,
    lineHeight: 22,
    color: "#FFFFFF",
  },
  boldText: {
    fontWeight: "bold",
  },
  scrollContents: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  buttonDailyReport: {
    flex: 1,
  },
  SquareShapeView: {
    width: 500,
    height: 40,
    backgroundColor: "#00BCD4",
  },
  scrollView: {
    flex: 9,
    flexDirection: "column",
    width: "100%",
  },
  dailyHeader: {
    width: "100%",
    flex: 1,
    marginTop: "10%",
    alignItems: "center",
    backgroundColor: "#00BCD4",
  },
  dailyReport: {
    width: "100%",
    flex: 7,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
