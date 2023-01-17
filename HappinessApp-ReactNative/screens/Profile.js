import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  _Text,
  _Button,
  SafeAreaView,
  Image,
  ScrollView,
  View,
  TouchableOpacity, Alert,
} from "react-native";
import { NetworkContext } from "../contexts/Networking";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default class Profile extends React.Component {
  static contextType = NetworkContext;

  componentDidMount() {
    this.context.getUserMeta();
  }

  render() {
    const { navigate } = this.props.navigation
    const user = this.context.userInfo

    return (

      <LinearGradient
      colors={["#cef5ef", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.6, 0.75, 0.9]}
      style={styles.linearGradient}
      >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <Avatar.Text size={60} style={styles.avatar} label={user.firstname.charAt(0)
                                                           + user.lastname.charAt(0)}
       />

        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}> {user.firstname} {user.lastname}</Text>
            <Text style={styles.info}>Tree Owner</Text>
            <Text style={styles.description1}>
              Welcome to your personal space.
            </Text>
           <Text style={styles.description2}>
              How has your day been?
            </Text>

            {this.context.isAdmin &&
              (<TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigate("Manage Journeys")}
              >
                <Text>Manage Journeys</Text>
              </TouchableOpacity>)
            }




            <Button
              autoCapitalize="none"
              style={styles.button1}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={()=>navigate("History")}>
              <Ionicons style={{paddingRight:15, paddingTop:50}} name="time-outline" size={25} />
              <Text style={styles.buttonText1}> Quest History </Text>
            </Button>

            <Button
              autoCapitalize="none"
              style={styles.button2}
              title='continue'
              mode="contained"
              // dark='true'
              onPress={this.context.signOut}>
              <Text style={styles.buttonText2}> Sign Out </Text>
            </Button>

          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  button1:{
    marginTop: 40,
    width: 200,
    height: 50
  },
  button2:{
    marginTop: 40,
    width: 200
  },
  buttonText1:{
    color: "white",
  },
  buttonText2:{
    color: "white",
    alignItems: 'center',
    justifyContent: 'center'
  },
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    backgroundColor: "#BADEDE",
    flex: 1,
    height: 180,
  },
  avatar: {
    flex: 1,
    width: "20%",
    height: "28%",
    backgroundColor: "#e0fff0",
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#3c1e63",
    alignSelf: "center",
    position: "absolute",
    resizeMode: "cover",
    marginTop: "10%",
  },
  body: {
    flex: 2,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
  },
  name: {
    fontSize: 28,
    color: "#3c1e63",
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#22AAAA",
  },
  description1: {
    marginTop: 20,
    fontSize: 16,
    color: "#696969",
    textAlign: "center",
  },
  description2: {
      fontSize: 16,
      color: "#696969",
      textAlign: "center",
    },
  buttonContainer: {
    marginTop: 8,
    height: 45,
    width: '48%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 30,
    textAlign: "center",
    backgroundColor: "#22AAAA",
  },

});
