import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import {NetworkContext} from "../../contexts/Networking";

export default class SplashScreen extends React.Component {
  static contextType = NetworkContext;

  componentDidMount = async () => {
    this.context.loadToken();
  };

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ImageBackground source={require("../../assets/HappinessAppFlash.png")} style={styles.image}>
		<Text style={styles.heading}> Happiness App</Text>
        </ImageBackground>
       
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    color: "#918573",
	textAlign: "center",
	fontWeight: "bold"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});
