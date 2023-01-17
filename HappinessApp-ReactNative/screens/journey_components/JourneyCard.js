import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

class JourneyCardComponent extends Component {
  handleJourneyTap = () => {
    const { quest } = this.props;
    const { navigate } = this.props.navigation;
    navigate("Quest", { quest });
  };
  render() {
    const { quest } = this.props;
    return (
      <View style={styles.card}>
        <Text style={styles.description}>Quest: {quest.name}</Text>
        <TouchableOpacity
          style={styles.beginButton}
          onPress={() => {
            this.handleJourneyTap();
          }}
        >
          <Text style={styles.buttontext}>Begin Exercise</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowOpacity: 0.6,
    shadowRadius: 9,
    elevation: 3.5,
    shadowOffset: {
      width: 15,
      height: 20,
    },
    shadowColor: "#000",
  },
  beginButton: {
    width: 200,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#7E6847",
    borderRadius: 30,
    borderColor: "#fff",
    alignItems: "center",
  },

  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },

  buttontext: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },

});

export default JourneyCardComponent;
