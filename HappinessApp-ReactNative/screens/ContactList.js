import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
  Alert
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {Button} from 'react-native-paper'

import { NetworkContext } from "../contexts/Networking";
// import Friend from "./Components/Friend";
import { Friend } from "./Friends";
// import { CheckBox } from "react-native-elements";
// import { uid } from "react-uid";
// import { width } from "react-native-password-strength-meter/src/style";

var reset = false

export default class ContactList extends React.Component {
  static contextType = NetworkContext;
  state = {
    contacts: [],
    selectedContacts: [],
    // selectedChecks: [false,false,false,false,false,false,false],
    groups: [],
    lastChat: "",
  };
  selected = false
  getBuddies = async () => {
    await this.context.fetchBuddy();
  };

  addChat = async (group) => {
    this.context.createChat(group.name, group.members);
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getBuddies();
      this.setState({contacts: this.context.buddies});
    });
    
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  
  isSelected(contact) {
    //   console.log(this.state.selectedContacts.includes(contact.index))
      return this.state.selectedContacts.includes(contact.index);
  }
  
  handleCreateChat = () => {
    var newGroup = []
    for(let i = 0 ; i < this.state.selectedContacts.length ; i++){
      newGroup.push(this.state.contacts[this.state.selectedContacts[i]]);
    }
    if(this.state.selectedContacts.length != 0 && !this.state.groups.includes(newGroup)){
      this.state.groups.push(newGroup);
    }

    let toPost = {
      "name": "",
      "members": []
    }
    console.log(newGroup)
    for(let i = 0 ; i < newGroup.length ; i++){
      toPost["members"].push({"username": newGroup[i]});

      console.log(toPost["name"])
      toPost["name"] += newGroup[i] + ", ";
    }
    toPost["name"] += this.context.username;
    
    this.addChat(toPost);

    this.setState({
      selectedContacts: [],
    })

    this.props.navigation.goBack();



    reset = true
  }



  handleSelection(contact) {

    reset = false
    if(this.state.selectedContacts.includes(contact.index)){
        const filteredContacts = this.state.selectedContacts.filter(i => {
            return i !== contact.index;
          });
        this.state.selectedContacts = filteredContacts

        return
    }
    else{
      this.state.selectedContacts.push(contact.index)
      console.log(this.state.selectedContacts)
 
        return
    }
  }

  handleRemove(group){
    console.log(group)
    const filteredGroups = this.state.groups.filter(i => {
      return i !== group;
    });
    this.setState({
      groups: filteredGroups
    })
    
  }

  render() {
    var contactList = [];
    for (let i = 0; i < this.state.contacts.length; i++) {
      contactList.push(<Friend key={i} name={this.state.contacts[i]} />);
    }
    const groups = this.state.groups

    return (
        <LinearGradient
          colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.6, 0.75, 0.9]}
          style={styles.linearGradient}
        >
        <SafeAreaView>
            <FlatList data={contactList} renderItem={(contact) => (

                <View>
                    <ContactItem contact = {contact} handleSelection={this.handleSelection.bind(this)}/>

                </View>
                
                )}>
                
            </FlatList>

            <Button
                autoCapitalize="none"
                style={styles.createButton}
                title='Create Chat'
                mode="contained"
                // dark='true'
                onPress={this.handleCreateChat}>
                <Text style={styles.createButtonText}> Create Chat </Text>
            </Button>
            
            <FlatList data={groups} keyExtractor={(index) => index.toString()} renderItem={(group) => (

                <View >
                  <TouchableHighlight underlayColor="rgba(184,223,216,0.9)" style={styles.contact}> 
                        <View style={styles.groupContent}  ><Text style={{fontSize: 20}}>{group.item.toString()}</Text>
                          {/* <Button title={"X"} onPress={()=>{this.handleRemove(group.item)}}/> */}
                        </View>
                    </TouchableHighlight>
                    
                </View>
                
                )}>
                
            </FlatList>
        </SafeAreaView>
        </LinearGradient>
    );
  }
}

class ContactItem extends React.Component{
  state = {
    selected: false
  };
  handlePress(){
    const negated = !this.state.selected
    this.setState({
      selected: negated
    })
  }

  render(){
    const {contact, handleSelection} = this.props
    let isSelected = false
    if(reset){
      isSelected = false
      this.state.selected = false
    }
    else{
      isSelected = this.state.selected
    }
    return(
      <TouchableHighlight underlayColor="rgba(184,223,216,0.9)" style={[styles.contact, {backgroundColor: (isSelected ? "rgba(184,223,216,0.9)" : "#edf7f5")}]} onPress={() => {this.handlePress; this.setState({selected: !this.state.selected});handleSelection(contact) ;  }}> 
        <View style={styles.contactContent}><Text style={styles.name}>{contact.item.props.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}


const styles = StyleSheet.create({
    contact:{
        flex: 1,
        paddingLeft: 20,
        backgroundColor: "#edf7f5",
        fontSize: 20,
        borderStyle: "solid",
        borderColor: 'rgba(68,85,90,0.4)',
        height: 70,
    },
    createButton:{
      marginTop: 50,
      marginBottom: 20,
      width: "70%",
      alignSelf: "center",
      borderRadius: 50
    },
    createButtonText:{
      color: "white",
      fontSize: 15
    },
    name:{
      fontSize: 20,
      textAlign: "center",
      color: "#561d70"
    },
    linearGradient: {
    flex: 1,
    },
    contactContent:{
      flex:1,
      alignItems: "center",
      flexDirection: "row"
    },
    groupContent:{
      flex:1,
      alignItems: "center",
      flexDirection: "row",
      justifyContent:"space-evenly"
    },
    buttonStyle: {
      color: "rgba(160,210,250,1)",
    }
})