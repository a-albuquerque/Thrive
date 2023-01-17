import React, { useState, useEffect, useContext } from 'react';
import { RadioButton } from 'react-native-paper';
import { NetworkContext } from "../contexts/Networking";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";

const ShareQuest = ({ navigation, route }) => {
  const netContext = useContext(NetworkContext);
  const [checked, setChecked] = useState("first");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const onSubmit = () => {
    if(checked !== "first") sendMessages();
    navigation.navigate("Home");
  }

  const url = "https://thriveapp.pythonanywhere.com";

  const sendMessages = async () => {
    console.log("in send messages");
    let chats = await netContext.getChats();
    let buddies = await netContext.fetchBuddy();

    let dmChats = [] // chats with only two members
    for (let chat of chats) {
      if (chat.members.length === 2) {
        dmChats.push(chat);
      }
    }

    for (let buddy of buddies) {
      let dmExists = false;

      for (let dm of dmChats) {
        if (dm.members[0].username === buddy || dm.members[1].username === buddy) {
          dmExists = true;
          break;
        }
      }

      if (!dmExists) {
        this.context.createChat(`${this.context.username} and ${buddy}`, [{ "username": buddy }]);
      }
    }
    chats = await netContext.getChats();
    // console.log(selectedFriends);

    for (let chat of chats) {
      if (chat.members.length === 2) {
        let index = chat.members[0].username === netContext.username ? 1 : 0;
        if (selectedFriends.includes(chat.members[index].username)){
          // console.log("sending message to " + chat.members[index].username + " with chat id " + chat.chat_id)
          const data = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Token " + "bda2d1f46bdd9b31ee1aef5c2aae29a197c8502d", // thriveapp user token
            },
            body: JSON.stringify({
              chat_id: chat.chat_id,
              content: `Your buddy ${netContext.userInfo.firstname} just completed the quest \"${route.params.quest.name}\"! Go and congratulate them for staying on track.`
              
            })
          };

          const data2 = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Token " + "bda2d1f46bdd9b31ee1aef5c2aae29a197c8502d", // thriveapp user token
            },
            body: JSON.stringify({
              chat_id: chat.chat_id,
              content: `The following is a portion of the quest description: ${route.params.quest.description.substring(0, Math.min(route.params.quest.description.length, 500))} ...`
            })
          };

          const data3 = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Token " + "bda2d1f46bdd9b31ee1aef5c2aae29a197c8502d", // thriveapp user token
            },
            body: JSON.stringify({
              chat_id: chat.chat_id,
              content: `${checked === "third" ? `They wanted to show you their response: \"${route.params.answer}\"` : ""}`
            })
          };
      
          try {
            fetch(url + "/api/messages/send", data).then(()=>{
              fetch(url + "/api/messages/send", data2).then(()=>{
                if(checked === "third") fetch(url + "/api/messages/send", data3);
              })
            })
            
            
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  }


  useEffect(() => {
    netContext.fetchBuddy().then(value => setFriends(
      value.map((friend, i) => ({ id: i, name: friend }))));
    netContext.getUserMeta();
    // console.log(route.params.answer);
    // console.log(route.params.quest);
    // console.log(friends);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ justifyContent: "space-around" }}>
        <View style={{ flex: 2, justifyContent: "center", paddingLeft: 10, paddingRight: 10 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => { setChecked("first") }}
          >
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => { setChecked("first") }}

            />
            <Text> Don't share this quest with friends</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              setChecked("second");
            }}
          >
            <RadioButton
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked("second");
              }}
            />
            <Text> Share your completion of this quest with select friends </Text>

          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              setChecked("third");
            }}
          >
            <RadioButton
              value="third"
              status={checked === 'third' ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked("third");
              }}
            />
            <Text> Share this quest and your response with select friends </Text>
          </TouchableOpacity>
        </View>

        <DropDown items={friends} hidden={checked === "first"} selectedFriends={selectedFriends} setSelectedFriends={setSelectedFriends}/>

        <TouchableOpacity style={{ flex: 0.5, borderRadius: 20, backgroundColor: "pink", alignItems: "center", justifyContent: "center" }}
          onPress={onSubmit}>
          <Text> Submit </Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  )
}

import MultiSelect from 'react-native-multiple-select';
class DropDown extends React.Component {

  state = {
    selectedItems: []
  };


  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    let selectedFriends = [];
    for(let index of selectedItems){
      selectedFriends.push(this.props.items[index].name);
    }
    this.props.setSelectedFriends(selectedFriends);
  };

  render() {
    const { selectedItems } = this.state;
    // console.log(this.props.items);
    return (
      <View style={{ flex: 2, justifyContent: "center", opacity: this.props.hidden ? 0.0 : 1.0, paddingLeft: 10, paddingRight: 10, height: 50 }}>
        <MultiSelect
          hideTags
          items={this.props.items}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Select friends to share with"
          searchInputPlaceholderText="Search friends..."
          // onChangeInput={(text) => console.log(text)}
          // altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
          fixedHeight={true}
          style={{height: 20}}
          styleListContainer={{height: 200}}
        />
        <View>
          {this.multiSelect && this.multiSelect.getSelectedItemsExt(selectedItems)}
        </View>
      </View>
    );
  }
}

export default ShareQuest;