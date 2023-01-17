import "react-native-gesture-handler";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

import SubmitQuest from "../screens/SubmitQuest";
import JourneyScreen from "../screens/JourneyScreen";
import QuestScreen from "../screens/QuestScreen";
import QuestFeedbackScreen from "../screens/QuestFeedbackScreen";
import DailyQuestScreen from "../screens/DailyQuestScreen";
import Friends from "../screens/Friends";
import addBuddy from "../screens/addBuddy";
import seeBuddyRequest from "../screens/seeBuddyRequest";
import Profile from "../screens/Profile";
import Playground from "../screens/Playground";
import CreateJourneyScreen from "../screens/JourneyManagement/CreateJourneyScreen";
import CreateQuestScreen from "../screens/JourneyManagement/CreateQuestScreen";
import ManageAllJourneysScreen from "../screens/JourneyManagement/ManageAllJourneysScreen";
import ManageJourneyScreen from "../screens/JourneyManagement/ManageJourneyScreen";
import ManageQuestScreen from "../screens/JourneyManagement/ManageQuestScreen";
import Settings from "../screens/reminders/Settings";
import Chat from '../screens/Messaging/Chat';
import displayChats from "../screens/DisplayChats";
import { NetworkContext } from "../contexts/Networking";
import { Icon } from "react-native-elements";
import ContactList from "../screens/ContactList";
import SettingScreen from "../screens/Setting/SettingScreen";
import History from "../screens/History";
import ShareQuest from '../screens/shareQuest';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Stackk = createStackNavigator();

import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';





export class MainStackNavigator extends React.Component {
  static contextType = NetworkContext;

  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const modules = {
              Submit: "MaterialComm",
              Journey: "Entypo",
              Daily: "MaterialIcons",
              Friends: "FontAwesome",
              Profile: "FontAwesome",
            };
            const icons = {
              Submit: "tree",
              Journey: "flower", // or Leaf, rainbow,
              Daily: "today",
              Friends: "user-friends",
              Profile: "user-alt",
            };

            if (modules[route.name] === "MaterialComm")
              return (
                <MaterialCommunityIcons
                  name={icons[route.name]}
                  color={color}
                  size={size}
                />
              );
            else if (modules[route.name] === "MaterialIcons")
              return (
                <MaterialIcons
                  name={icons[route.name]}
                  color={color}
                  size={size}
                />
              );
            else if (modules[route.name] === "FontAwesome")
              return (
                <FontAwesome5
                  name={icons[route.name]}
                  color={color}
                  size={size}
                />
              );
            else if (modules[route.name] === "Entypo")
              return (
                <Entypo name={icons[route.name]} color={color} size={size} />
              );
          },
        })}
      >
        <Tab.Screen name="Journey" component={JourneyScreen} />
        <Tab.Screen
          name="Daily"
          component={DailyQuestScreen}
          options={{
            title: "Daily Quest",
          }}
        />
        <Tab.Screen name="Friends" component={Friends} />
        <Tab.Screen
          name="Submit"
          component={SubmitQuest}
          options={{
            title: "Create your own",
          }}
        />
        <Tab.Screen name="Profile"
          component={Profile}
          options={{
            title: "Profile",
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
      </Tab.Navigator>
    );
  }
}

export class MainStack extends React.Component {
  handleSettings = () => {
    navigation.goBack;
    console.log("Settings button");
  };

  render() {
    return (

      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainStackNavigator}
          options={({ route, navigation }) => ({
            headerTitle: getHeaderTitle(route),
            headerStyle: {
              backgroundColor: '#e6e6fa',

            },
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerRight: () => (
              <MaterialIcons style={styles.settings}
                name='settings'
                color="#5f3596"
                size={20}
                onPress={() => navigation.navigate("Settings")}
              />
            ),
          })}
        />
        <Stack.Screen name="Quest" component={QuestScreen} />
        <Stack.Screen name={"Feedback"} component={QuestFeedbackScreen} />
        <Stack.Screen name="Create Journey" component={CreateJourneyScreen} />
        <Stack.Screen name="Share Quest" component={ShareQuest} />
        <Stack.Screen
          name="Create Quest"
          component={CreateQuestScreen}
          initialParams={{
            journeys: [],
          }}
        />
        <Stack.Screen
          name="Manage Journeys"
          component={ManageAllJourneysScreen}
        />
        <Stack.Screen name="Manage Journey" component={ManageJourneyScreen} />
        <Stack.Screen name="Manage Quest" component={ManageQuestScreen} />
        <Stack.Screen name="addBuddy" component={addBuddy} />
        <Stack.Screen name="seeBuddyRequest" component={seeBuddyRequest} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="chat" component={Chat} />
        <Stack.Screen name="displayChats" component={displayChats} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>

    );
  }
}

export class OtherStack extends React.Component {
  render() {
    return (
      <Stackk.Navigator>
        <Stack.Screen name="Daily" component={DailyQuestScreen} />
        <Stackk.Screen name="Playground" component={Playground} />
      </Stackk.Navigator>
    )
  }
}

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Daily";

  switch (routeName) {
    case "Submit":
      return "Submit Your Quests";
    case "Journey":
      return "Journeys";
    case "Daily":
      return "Daily Quest";
    case "Friends":
      return "Friends";
    case "addBuddy":
      return "addBuddy";
    case "seeBuddyRequest":
      return "seeBuddyRequest";
    case "Profile":
      return "Profile";
    case "ContactList":
      return "ContactList";
  }
}




const styles = StyleSheet.create({
  input: {
    width: "90%",
    fontSize: 18,
    fontWeight: "500",
    height: 55,
    backgroundColor: "white",
    color: "fuchsia",
    margin: 10,
    padding: 8,
    borderRadius: 14,
  },

  container: {
    flex: 1,
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },

  button: {
    fontSize: 14,
    color: "#f194ff",
    fontFamily: "Comfortaa",
    letterSpacing: -0.015,
    width: "90%",
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "pink",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  buttoncontainer: {
    margin: 30,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    fontWeight: "bold",
  },
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  settings: {
    marginRight: 10
  },
});