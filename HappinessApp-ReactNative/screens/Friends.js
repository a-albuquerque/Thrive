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
  _Button,
  FlatList,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { NetworkContext } from "../contexts/Networking";
import {Button} from 'react-native-paper';

import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

export default class Friends extends React.Component {
  static contextType = NetworkContext;
  state = {
    buddies: "",
  };

  getBuddies = async () => {
    await this.context.fetchBuddy();
    this.setState({
      buddies: this.context.buddies,
    });
  };

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getBuddies();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  addBuddy = () => {
    this.props.navigation.navigate("addBuddy");
  };

  seeBuddyRequest = () => {
    this.props.navigation.navigate("seeBuddyRequest");
  };

  contactList = () => { // navigate to the contact list when clicking on the button to "create a group chat"
    this.props.navigation.navigate("ContactList");
  }


  chat = () => {
    this.props.navigation.navigate("chat");
  }

  displayChats = () => {
    this.props.navigation.navigate("displayChats");
  }

  render() {
    var friends = [];

    for (let i = 0; i < this.state.buddies.length; i++) {
      friends.push(<Friend key={i} name={this.state.buddies[i]} chat={this.chat}/>);
    }
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
            onPress={this.getBuddies}
          >
            <Text style={styles.refreshText}>  </Text>
            <Ionicons name="refresh-circle-sharp" color="#632c9e" size={25} />
            <Text style={styles.refreshText}> Refresh   </Text>
          </TouchableOpacity>

        <ScrollView style={styles.body} contentContainerStyle={{alignItems: "center"}}>
        {/* <View style={styles.body}> */}
          <View style={styles.buttonContainer}>
          



            <View style={styles.req}>

            <Button
              autoCapitalize="none"
              style={styles.viewRequests}
              title='Requests'
              mode="contained"
              onPress={this.seeBuddyRequest}>
              <Text style={styles.viewRequestsText}> Requests </Text>
            </Button>

            <Button
              autoCapitalize="none"
              style={styles.sendRequest}
              title='Send Request'
              mode="contained"
              onPress={this.addBuddy}>
              <Text style={styles.sendRequestText}> + </Text>
            </Button>

            </View>


            <View style={styles.chat}>

            <Button
              autoCapitalize="none"
              style={styles.viewChats}
              title='Display Chats'
              mode="contained"
              onPress={this.displayChats}>
              <Text style={styles.viewChatsText}> Chats</Text>
            </Button>
            
            <Button
              autoCapitalize="none"
              style={styles.newChat}
              title='New Chat'
              mode="contained"
              onPress={this.contactList}>
              <Text style={styles.newChatText}> + </Text>
            </Button>

            </View>

          </View>
        </ScrollView>
        {/* </View> */}
      </SafeAreaView>
      </LinearGradient>
    );
  }
}

export class Friend extends React.Component {
  state = {
    name: "React",
  };
  render() {      
    return (
    <View style={styles.friend}>
        <View style={styles.avatar}>
            <Ionicons  name="ios-people" size={25}  />          
        </View>
        <View style={styles.textBox}>
          {/* <View flexDirection="row"> */}
            <Text style={styles.name}> {this.props.name} </Text>
          {/* </View> */}
        </View>
        <TouchableOpacity style={styles.buttonM} onPress={this.props.chat}>
            <MaterialIcons name="message" size={28} color="black" />
          </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  req: {
    flexDirection: "row",
    marginTop: 30
  },
  viewRequests:{
    width: 150,
    borderRadius: 50
  },
  viewRequestsText:{

  },
  sendRequest:{
    backgroundColor: "#0e451d",
    width: 35,
    borderRadius: 50
  },
  sendRequestText:{
    textAlign: "left"
  },
  chat:{
    flexDirection: "row",
    marginTop: 25
  },
  viewChats:{
    width: 150,
    borderRadius: 50
  },
  viewChatsText:{

  },
  newChat:{
    marginRight: 30,
    backgroundColor: "#0e451d",
    width: 35,
    borderRadius: 50
  },
  newChatText:{
    textAlign: "left"
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
  linearGradient: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    //justifyContent: "center",
    //alignItems: "center",
  },

  body: {
    // backgroundColor: "white",
    margin: 20,
    width: windowWidth,
    flex: 1,
  },
  friend:{
    flex:1,
    // padding: 20,
    flexDirection:"row",
  },
  name: {
    fontSize: 16,
    // Gives error on iOS
    // fontFamily: "Comfortaa-Regular",
    color: "#918573",
    fontWeight: "bold",
  //   textAlign: "justify",
  },
  friendsList:{
    flex:1,
    flexDirection:"column",
    // justifyContent: "space-between"
  },
  // info: {
  //   fontSize: 15,
  //   color: "#22AAAA",
  //   textAlign: "justify",
  // },
  // description: {
  //   fontSize: 16,
  //   color: "#696969",
  //   marginTop: 8,
  //   textAlign: "justify",
  // },
  avatar:{
    // flex:1,
    color:"black",
    // // backgroundColor: "grey",
    borderRadius: 50,
    borderWidth: 1,
    // // padding: 10,
    width: 40,
    height: 40,
    alignItems:"center",
    justifyContent: "center",
    // alignContent:"center",
  },
  title: {
    fontSize: 23,
    color: "#918573",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 10,
  },
  actionButton: {

    // width: "30%",
    height:50,
  },
  buttonContainer: { 
    // flex: 1,
    // flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    // flexWrap: "wrap"
  },
  // chatButton: {
  //   marginTop: 8,
  //   height: 40,
  //   width: "15%",
  //   padding: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // borderRadius: 30,
  //   textAlign: "center",
    
  // },
  textBox: {
    paddingLeft:10,
    // alignItems:"flex-start"
    // backgroundColor: "lightgrey",
    flex:1,
    // textAlign: "center",
    justifyContent: "center",
    }
  // line: {
  //   backgroundColor: "#E5E5E5",
  //   height: 1,
  //   marginTop: 8,
  // },
});
