import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./screens/WelcomeScreen";
import SplashScreen from "./screens/Authentication/SplashScreen";
import LoginStackNavigator from "./navigation/LoginStackNavigator";
import { MainStack } from "./navigation/MainStackNavigator";
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NetworkContext, NetworkContextProvider } from "./contexts/Networking";


export default class App extends React.Component {
  state = {
    welcomeFinished: false,
  };


  render() {
    const { welcomeFinished } = this.state;
    console.log("Rendering");

    return (
    <PaperProvider>
      <NetworkContextProvider>
        <NavigationContainer>
          <NetworkContext.Consumer>
            {(context) => {
              return context.isLoading ? (
                <SplashScreen />
              ) : context.isAuthenticated ? (
                <MainStack/>)
                 : (
                <LoginStackNavigator />
              )
            }
            }
          </NetworkContext.Consumer>
        </NavigationContainer>
      </NetworkContextProvider>
    </PaperProvider>
    );
  }
}
