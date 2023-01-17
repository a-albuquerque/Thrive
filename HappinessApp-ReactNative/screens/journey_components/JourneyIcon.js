import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";

// Component for the Journey Icons
class JourneyIconComponent extends Component {
  // Pass in current journey into selectedJourney for parent state
  handleJourneyTap = (journey) => {
    this.props.onJourney(journey);
  };
  render() {
    const { journey, showPopup } = this.props; // Extract journey object and showPopup from parent
    const { name } = journey; // Extract name and image from journey object
    return (
      // Depending on whether showPopup is true or not, change the colour of the icon to simulate a dim effect
      <TouchableOpacity
        style={[
          styles.journeyButton,
          !showPopup
            ? { backgroundColor: "#BADEDE", borderColor: "#fff" }
            : { backgroundColor: "#5d6f6f", borderColor: "#7f7f7f" },
        ]}
        onPress={() => this.handleJourneyTap(journey)} // When icon is selected
      >
        {/*Image and name for journey icon*/}
        {/* <Image style={styles.journeyIcon} source={image} /> */}
        <Text
          style={
            [styles.text,
            !showPopup ? { color: "#085454" } : { color: "#053a3a" }]
          }
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  }
}

// Styles for button and icon
const styles = StyleSheet.create({
  journeyButton: {
    width: "22%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 25,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 3.5,
    shadowOffset: {
      width: 12,
      height: 18,
    },
    shadowColor: "#000",
  },
  journeyIcon: {
    width: 70,
    height: 70,
    borderRadius: 10,
    // resizeMode: "contain"
  },

  text: {
    paddingTop: 5,
  },
});

export default JourneyIconComponent;
