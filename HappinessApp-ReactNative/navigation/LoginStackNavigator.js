import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUp1 from "../screens/Authentication/SignUp1";
import SignUp2 from "../screens/Authentication/SignUp2";
import LogIn from "../screens/Authentication/LogIn";
import ForgotPassword from "../screens/Authentication/ForgotPassword";
import Authentication from "../screens/Authentication/Authentication";
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';

const Stack = createStackNavigator();

export default class LoginStackNavigator extends React.Component {
  render() {
    return (

      <Stack.Navigator>
        {/* <Stack.Screen name="Authentication" component={Authentication} /> */}


        <Stack.Screen name="LogIn"
                  component={LogIn}
                  options={{title: "",
                            headerStyle: {
                                           backgroundColor: '#e6e6fa',

                            },
                            headerTintColor: '#000000',
                            headerTitleStyle: {
                                           fontWeight: 'bold',
                                           textAlign: 'center',
                            },
                           }}
        />
        <Stack.Screen name="SignUp1"
                   component={SignUp1}
                   options={{title: "",
                              headerStyle: {
                                             backgroundColor: '#e6e6fa',

                              },
                              headerTintColor: '#000000',
                              headerTitleStyle: {
                                             fontWeight: 'bold',
                                             textAlign: 'center',
                              },
                             }}
        />
        <Stack.Screen name="SignUp2"
                  component={SignUp2}
                  options={{title: "",
                  headerStyle: {
                                 backgroundColor: '#e6e6fa',

                  },
                  headerTintColor: '#000000',
                  headerTitleStyle: {
                                 fontWeight: 'bold',
                                 textAlign: 'center',
                  },
                 }}
        />
        {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}

      </Stack.Navigator>
    );
  }
}
