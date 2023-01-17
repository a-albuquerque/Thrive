
import { NetworkContext } from "../contexts/Networking";
import React, {useState, useContext} from "react";


import "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
//import Friend from "./Friends";
//import { Friend } from "./Friends";
// import { CheckBox } from "react-native-elements";
// import { uid } from "react-uid";
// import { width } from "react-native-password-strength-meter/src/style";
import {
    StyleSheet,
    _Text,
    SafeAreaView,
    ScrollView,
    View,
    TouchableOpacity,
    _Button,
    FlatList,
  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput, Text, Button, Provider as PaperProvider } from 'react-native-paper';



export default class displayChats extends React.Component {

    static contextType = NetworkContext;
    state = {
      chats: [],
      buddies: [],
    };

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
          this.getChats();
        });
    }

    chat = (chat_id) => {
        this.props.navigation.navigate("chat", {chat_id: chat_id});
    }

    getChats = async () => {
        let chats = await this.context.getChats();
        let buddies = await this.getBuddies();

        let dmChats = [] // chats with only two members
        for(let chat of chats){
          if(chat.members.length === 2){
            dmChats.push(chat);
          }
        }

        for(let buddy of buddies){
          let dmExists = false;

          for(let dm of dmChats){
            if(dm.members[0].username === buddy || dm.members[1].username === buddy){
              dmExists = true;
              break;
            }
          }

          if(!dmExists){
            this.context.createChat(`${this.context.username} and ${buddy}`, [{"username": buddy}]);
          }
        }
        chats = await this.context.getChats();
        
        this.setState({...this.state, chats : chats});
    };

    getBuddies = async () => {
        let buddies = await this.context.fetchBuddy();
        this.setState({
          ...this.state, buddies: this.context.buddies,
        });
        return buddies;
    };
    
 

    render(){


    let chats = [];

    for (let i = 0; i < this.state.chats.length; i++) {
      chats.push(<_Friend key={i} name={ this.state.chats[i].name } 
                                  chat={this.chat} chat_id={this.state.chats[i].chat_id}/>);
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

        <ScrollView style={styles.body}>

            <Text style={styles.title}>Your Chats </Text>

            {chats}

        </ScrollView>
      </SafeAreaView>
      </LinearGradient>
    );
    

}; // end of render


} // end of export Display Chats


export class ChatItem extends React.Component {

    // toChat = (chat_id) => {
    //     this.props.navigation.navigate("chat");
    // }

    state = {
      name: "React",
    };
    render() {      
      return (
        <View style={styles.actionButton}>  
        <Button
            title={this.props.name} 
            color="#63915e"
        />
        </View>
      );
    }
  }




export class _Friend extends React.Component {
  state = {
    name: "React",
  };
  render() {      
    return (
    <View style={styles.friend}>
        <View style={styles.avatar}>
            <Ionicons  name="ios-people" color="#561d70" size={25}  />          
        </View>
        <View style={styles.textBox}>
          {/* <View flexDirection="row"> */}
            <Text style={styles.name}> {this.props.name} </Text>
          {/* </View> */}
        </View>
        <TouchableOpacity style={styles.buttonM} onPress={()=>this.props.chat(this.props.chat_id)}>
            <MaterialIcons name="message" size={28} color="green" />
          </TouchableOpacity>
    </View>
    );
  }
}
    










const styles = StyleSheet.create({
    body: {
      margin: 20,
    },
    linearGradient: {
    flex: 1,
    },
    friend:{
      marginTop: 30,
      flex:1,
      flexDirection:"row",
    },
    name: {
      fontSize: 16,
      color: "#561d70",
      fontWeight: "bold",
    },
    avatar:{
      color:"black",
      borderRadius: 50,
      borderWidth: 1,
      width: 40,
      height: 40,
      alignItems:"center",
      justifyContent: "center",
    },
    title: {
      marginTop: 10,
      fontSize: 23,
      alignItems: "center",
      textAlign: "center",
      color: "#561d70",
      fontWeight: "bold",
    },
    actionButton: {
        height:50,
    },
    buttonContainer: { 
      justifyContent: "space-between",
    },
    textBox: {
      paddingLeft:10,
      flex:1,
      justifyContent: "center",
      }
  });
