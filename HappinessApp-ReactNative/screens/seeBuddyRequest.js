import "react-native-gesture-handler";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { NetworkContext } from "../contexts/Networking";
import { LinearGradient } from 'expo-linear-gradient';
//import { Button } from "react-native-paper";

import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

export default class seeBuddyRequest extends React.Component {
  static contextType = NetworkContext;
  state = {
    br: "",
    b_requests: []
  };

  getBuddyRequests = async () => {
    let buddies = await this.context.fetchBuddyRequest();
    let b_requests = [];
    for (let i = 0; i < buddies.length; i++) {
      b_requests.push(<BR key={i} name={buddies[i]} />);
    }
    this.setState({...this.state, b_requests: b_requests});
    return buddies;
  };

  componentDidMount() {
    this.getBuddyRequests();
  }

  close = () => {
    this.setState({ opened: false });
  };

  render() {

    return (
      <LinearGradient
          colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6, 0.75, 0.9]}
          style={styles.linearGradient}
      >
      <SafeAreaView style={styles.container}>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={this.getBuddyRequests}
        >
          <Text style={styles.refreshText}>  </Text>
          <Ionicons name="refresh-circle-sharp" color="#632c9e" size={25} />
          <Text style={styles.refreshText}> Refresh   </Text>
        </TouchableOpacity>

        <ScrollView style={styles.body} contentContainerStyle={{alignItems: "center", paddingHorizontal: 20}}>
          {this.state.b_requests}
          {this.state.b_requests.length === 0 && <Text> No Buddy Requests</Text>}
        </ScrollView>
      </SafeAreaView>
      </LinearGradient>
    );
  }
}

class BR extends React.Component {
  static contextType = NetworkContext;
  state = {
    opened: true,
  };
  accept = (b) => {
    this.setState({ opened: false });
    this.context.acceptBuddyRequest(b);
  };

  reject = (b) => {
    this.setState({ opened: false });

    this.context.rejectBuddyRequest(b);
  };
  render() {
    return (
      this.state.opened && (
        <View>
          <View flexDirection="row" alignItems="stretch">
            <Ionicons name="person-circle-outline" size={40} color="#561d70" />

            <View alignItems="flex-start" width="75%" textAlign="justify">
              <View flexDirection="row">
                <Text style={styles.name}> {this.props.name} </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonM}
              onPress={() => this.accept(this.props.name)}
            >
              <MaterialIcons name="check" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonL}
              onPress={() => this.reject(this.props.name)}
            >
              <MaterialIcons name="close" size={30} color="red" />
            </TouchableOpacity>
          </View>

          <View style={styles.line} />
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  refreshButton: {
    right: 30,
    marginTop: 10,
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "#c1cdf5",
    borderRadius: 50
  },
  refreshText: {
    marginTop: 5,
    color: "#632c9e",
    fontSize: 12
  },
  container: {
    //justifyContent: "center",
    //alignItems: "center",
  },

  body: {
    marginTop: 50,
    backgroundColor: "transparent",
    margin: 20,
    width: windowWidth,
  },

  name: {
    fontSize: 16,
    // Gives error on iOS
    // fontFamily: "Comfortaa-Regular",
    marginTop: 10,
    marginLeft: 10,
    color: "#561d70",
    fontWeight: "bold",
    textAlign: "justify",
  },
  info: {
    fontSize: 15,
    color: "#22AAAA",
    textAlign: "justify",
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 8,
    textAlign: "justify",
  },
  button1: {
    paddingTop: 10,
  },
  button2: { paddingTop: 10 },
  buttoncontainer: { padding: 10 },
  buttonM: {
    left: -35,
    marginTop: 8,
    paddingRight: 10,
  },
  buttonL: {
    left: -20,
    marginTop: 8,
  },

  line: {
    backgroundColor: "#E5E5E5",
    height: 1,
    marginTop: 8,
  },
});
