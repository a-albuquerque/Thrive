import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { registerForPushNotificationsAsync } from "./networkingHelpers/notifications";
import * as Notifications from 'expo-notifications';

export const NetworkContext = React.createContext({
  // User Authentication and info
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  username: "",
  signUp: () => {},
  signIn: async () => {},
  signOut: () => {},
  loadToken: () => {},
  getUserMeta: () => {},
  // Cached data and methods to retrieve it
  journeys: [],
  buddies: "",
  registerSuccess: "",
  buddy_requests: "",
  userInfo: {
    firstname: "",
    lastname: "",
    age: -1,
  },
  messageThread: [],
  chats: [],
  curr_chat_id: -1,
  getJourneys: () => {},
  getIncompleteJourney: () => {},
  // Methods to retrieve non-cached data
  getJourneyInfo: () => {},
  getJourneyProgress: () => {},

  // Methods to complete a quest
  activateJourney: () => {},
  completeQuest: () => {},
  checkThirdJourney: () => {},
  dropJourney: () => {},
  getActiveJourneys: () => {},
  checkCompleteJourney: () => {},
  getAllQuests: () => {},
  finishJourney: () => {},
  
  // BuddyRequest
  sendBuddyRequest: () => {},
  acceptBuddyRequest: () => {},
  rejectBuddyRequest: () => {},

  // submit a journey or quest
  uploadJourney: () => {},
  submitQuest: () => {},

  // Alerts
  displayNoConnectionAlert: () => {},
  displayInvalidInfoAlert: () => {},

  //Messages
  getChats: () => {},
  getAllChatMessages:  () => {},
  sendMessage: () => {},
  createChat: () => {}
});


const url = "https://thriveapp.pythonanywhere.com";

export class NetworkContextProvider extends React.Component {
  state = {
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
    username: "",
    registerSuccess: "",
    journeys: [],
    incompleteJourney: {
      description: "",
      id: null,
      media: null,
      name: "",
      quests: []
    },

    buddies: [],
    buddy_requests: [],

    userInfo: {
      firstname: "",
      lastname: "",
      age: -1,
    },

    messageThread: [],
    chats: [],
    curr_chat_id: -1,

  };

  // Send new user registration date to the server, get new token
  signUp = async (username, password, email, firstName, lastName, age, sex) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        username: username,
        email: email,
        password: password,
        age: age,
        sex: sex,
      }),
    };
    try {
      let fetchResponse = await fetch(url + "/api/auth/register/", data);
      let respJson = await fetchResponse.json();
      if (respJson.response == "Unsuccessful") {
        this.registerFailAlert();
        this.setState({
          registerSuccess: "f",
        });
      } else {
        this.registerSuccessAlert();
        this.setState({
          registerSuccess: "t",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Send username/password to the server, get token
  signIn = async (login, password) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
      body: JSON.stringify({
        username: login,
        password: password,
      }),
    };
    try {
      let fetchResponse = await fetch(url + "/api/auth/login/", data);
      let respJson = await fetchResponse.json();

      if (respJson.token) {
        console.log("Authenticated!");
        this.setState({
          token: respJson.token,
          isAuthenticated: true,
          username: login,
        });
        await this.setToken(respJson.token);
        await AsyncStorage.setItem("username", login);
        await this.checkIfAdmin();
        await this.getUserMeta();
        await registerForPushNotificationsAsync(this.state.token); // not using those notifications right now
      } else {
        console.log("Authentication Failed!");
        this.WrongPasswordAlert();
        await this.fetchBuddy();
        await this.fetchBuddyRequest();
      }
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
    }
  };

  // SignOut
  signOut = async () => {
    this.setState({
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      username: "",
      buddies: [],
      buddy_requests: [],
    });
    // Cancel all scheduled notifications as user signed out
    await Notifications.cancelAllScheduledNotificationsAsync().then(() => {
      console.log('All scheduled notifications cancelled as user signed out.')
    }).catch(() => {
      console.log('Error cancelling scheduled notifications')
    })

    await fetch(url + "/api/auth/set-expo-token/",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Token " + this.state.token,
            },
            body: JSON.stringify({
                expo_token: ""
            })
        }).then(response => response.json())
        .then(data => console.log(data))
      
    await this.removeToken();
  };

  // Load token
  loadToken = async () => {
    await AsyncStorage.getItem("token").then((value) => {
      console.log("Retrieved token: ", value);
      if (value == null) {
        this.setState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        this.setState({
          token: value,
          isAuthenticated: true,
          isLoading: false,
        });
        // registerForPushNotificationsAsync(); // not using those notifications right now
      }
    });
    await this.checkIfAdmin();

    AsyncStorage.getItem("username").then(value => {
      this.setState({...this.state, username: value});
    })
  };

  // Set token
  setToken = async (token) => {
    await AsyncStorage.setItem("token", token);
  };

  // Remove token from the storage
  removeToken = async () => {
    await AsyncStorage.removeItem("token");
  };

  // Check if user is an Admin
  checkIfAdmin = async () => {
    const data = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let response = await fetch(url + "/api/auth/is_admin/", data);
      let respJson = await response.json();
      if (respJson.status) {
        this.setState({
          isAdmin: true,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
      return false;
    }
  };

  getUserMeta = async () => {
    const data = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let response = await fetch(url + "/api/auth/get_user_meta/", data);
      let respJson = await response.json();
      this.setState({
        userInfo: {
          firstname: respJson.firstname,
          lastname: respJson.lastname,
          age: respJson.age,
        },
      });
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
    }
  };

  // Get journeys from the server
  getJourneys = async () => {
    console.log("Beginning journeys fetch");
    const data = {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let fetchResponse = await fetch(url + "/api/journeys/", data);
      let respJson = await fetchResponse.json();
      this.setState({
        journeys: respJson,
      });
    } catch (e) {
      this.displayGetJourneyAlert();
    }
  };

 // Get the information of the incomplete journey
 getIncompleteJourney = async () => {
  console.log("Beginning daily quests fetch");
  const data = {
    method: "GET",
    headers: {
      Authorization: "Token " + this.state.token,
    },
  };
  try {
    let fetchResponse = await fetch(url + "/api/progress/incompleteJourney/", data);
    if(fetchResponse == null) {return null;}
    let respJson = await fetchResponse.json();
    // this.setState({
    //   incompleteJourney: {
    //     description: respJson.description,
    //     id: respJson.id,
    //     media: respJson.media,
    //     name: respJson.name,
    //     quests: respJson.quests
    //   }
    // });
    return respJson;
  } catch (e) {
    console.log(e);
    this.displayNoDailyQuestAlert();
    return null;
  }
};

  // Get info of a particular journey with given id
  getJourneyInfo = async (journeyId) => {
    const data = {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let fetchResponse = await fetch(
        url + "/api/journeys/" + journeyId + "/",
        data
      );
      const respJson = await fetchResponse.json();
      // let Response = await fetch(
      //    url + "api/journeys/" + journeyId + "/quests/", data);

      // const Json = await Response.json();
      // respJson.quests = Json;
      return respJson;
    } catch (e) {
      this.displayNoConnectionAlert(e);
      return [];
    }
  };

  // Get progress of a particular journey with given id
  getJourneyProgress = async (journeyId) => {
    const data = {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let fetchResponse = await fetch(
        url + "/api/progress/getJourneyProgress/" + journeyId + "/",
        data
      );
      const respJson = await fetchResponse.json();
      return respJson;
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
      return [];
    }
  };

  activateJourney = async (journeyId) => {
    const data = {
      method: "POST",
      headers:{
        Authorization: "Token " + this.state.token,
      },
    };
    try{
      let fetchResponse = await fetch(
        url + "/api/auth/active_journeys/" + journeyId + "/", data
      );
      const respJson = await fetchResponse.json();
      this.displayActivateJourneyAlert();
      return respJson;
    }catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return []
    }
  };

  // Drop a journey based on the given jid
  dropJourney = async (journeyId) => {
    const data = {
      method: "DELETE",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let fetchResponse = await fetch(
        url + "/api/progress/dropJourney/" + journeyId + "/",
        data
      );
      let response = await fetch(
        url + "/api/auth/active_journeys/" + journeyId + "/", data
      );
      const respJson = await fetchResponse.json();
      const respJ = await response.json();
      this.displayDropJourneyAlert();
      if (respJson.success == "Success" && respJ.response == "Success") {
        return respJson;
      }else{
        return null;
      }
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
      return [];
    }
  };

  finishJourney = async (journeyId) => {
    const data = {
      method: "DELETE",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try {
      let response = await fetch(
        url + "/api/auth/active_journeys/" + journeyId + "/", data
      );
      const respJ = await response.json();
      if (respJ.response == "Success") {
        return respJ;
      }else{
        return null;
      }
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
      return [];
    }
  };

  getActiveJourneys = async () => {
    const data = {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.token,
      },
    };
    try{
      let fetchResponse = await fetch(
        url + "/api/auth/get_active_journeys/", data
      );
      const respJson = await fetchResponse.json();
      return respJson;
    }catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return []
    };
  };

  // Set a particular quest to be complete with given id
  completeQuest = async (
    journeyId,
    questId,
    answer,
    feelingRating,
    questRating,
    surveyAnswer
  ) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        jid: journeyId,
        answer: answer,
        feeling_rating: feelingRating,
        quest_rating: questRating,
        survey_answer: surveyAnswer,
      }),
    };
    const datata = {
      method: "GET",
      headers: {
        Authorization: "Token " + this.state.token,
      }, 
    }
    try {
      let fetchResponse = await fetch(
        url + "/api/progress/completeQuest/" + questId + "/",
        data
      );
      const respJson = await fetchResponse.json();
      let fetchresp = await fetch(
        url + "/api/progress/checkCompleteJourney/" + journeyId + "/", datata
      );
      const respJ = await fetchresp.json();
      if(respJ.response == "true"){
        this.displayCompleteJourneyAlert();
      }
      this.displayCompleteQuestAlert();
      return respJson;
    } catch (e) {
      console.log(e);
      this.displayNoConnectionAlert(e);
      return [];
    }
  };

  // submit journey
  uploadJourney = async (
      journeyName,
      journeyDescription,
      quests,
      emaill,
      namae
  ) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        name: journeyName,
        description: journeyDescription,
        email: emaill,
        user_name: namae,
        quests: quests
      }),
    };
    try{
      let fetchResponse = await fetch(
          url + "/api/journeys/submit-journeys", data
      );
      const respJson = await fetchResponse.json();
      if (!fetchResponse.ok){
        throw new Error();
      }
      else {
        this.displaySuccessAlert();
      }
      return respJson;
    } catch (e){
      console.log(e);
      this.displayInvalidInfoAlert();
      return [];
    }
  };

  checkCompleteJourney = async(jid) => {
    const data = {
      method: "GET",
      headers:{
        Authorization: "Token " + this.state.token,
      }
    };
    try{
      let fetchResponse = await fetch(url + "/api/progress/checkCompleteJourney/" + jid + "/", data);
      const respJson = await fetchResponse.json();
      return respJson;
    }catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return null;
    };
  };
  
  checkThirdJourney = async (jid) => {
    const data = {
      method: "GET",
      headers:{
        Authorization: "Token " + this.state.token,
      }
    };
    try{
      let fetchResponse = await fetch(
        url + "/api/auth/get_active_journeys/", data
      );
      const respJson = await fetchResponse.json();
      const respLis = [];
      for(let i = 0; i < respJson.length; i++){
        respLis.push(respJson[i].id);
      }
      if(respLis.length >= 2 && !(respLis.includes(jid)) ){
        this.displayThirdJourneyAlert();
        return null;
      }
      return respJson;
    } catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return null;
    }
  };

  fetchQuestHistory = async () => {
      const data = {
        method: "GET",
        headers:{
          Authorization: "Token " + this.state.token,
        }
      };
      try{
        let fetchResponse = await fetch(url + "/api/progress/get-quest-history", data);
        const respJson = await fetchResponse.json();
        return respJson;
      }catch(e){
        console.log(e);
        this.displayNoConnectionAlert(e);
        return null;
      };
  };

  getAllQuests = async () => {
    const data = {
      method: "GET",
    };
    try{
      let fetchResponse = await fetch(
        url + "/api/journeys/allquests/", data
      );
      const respJson = await fetchResponse.json();
      return respJson;
    } catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return null;
      };
  };

  sendBuddyRequest = async (buddy) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
         Authorization: null,
      },
      body: JSON.stringify({
        from: this.state.username,
        to: buddy,
      }),
    };
    if (buddy == this.state.username) {
      this.SameNameAlert();
    } else {
      try {
        let fetchResponse = await fetch(
          url + "/api/auth/send_buddy_request/",
          data
        );
        if(!fetchResponse.ok) {
          console.log("the response to /api/auth/send_buddy_request/ was not a 200 response");
          return;
        }
        let respJson = await fetchResponse.json();
        if (respJson.response == "Buddy request sent!") {
          this.buddyRequestSuccessAlert(buddy);
        } else if (respJson.response == "Buddy request already sent!") {
          this.buddyRequestSuccessAlert(buddy);
        } else if (respJson.response == "Same User") {
          this.SameNameAlert();
        } else if (respJson.response == "Already buddy!") {
          this.alreadyBuddyRequestSuccessAlert();
        } else if (respJson.response == "No such user") {
          this.noUserAlert();
        } else if (respJson.response == "Buddies") {
          this.nowBuddiesAlert();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };


  // submit quest
  submitQuest = async (
      quests,
      user_name,
      email
  ) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        quests: quests,
        user_name: user_name,
        email: email
      }),
    };
    try{
      let fetchResponse = await fetch(
          url + "/api/journeys/submit-quests", data
      );
      const respJson = await fetchResponse.json();
      if (!fetchResponse.ok){
        throw new Error();
      }
      else {
        this.displaySuccessAlert();
      }
      return respJson;
    } catch (e){
      console.log(e);
      this.displayInvalidInfoAlert();
      return [];
    }
  };

  acceptBuddyRequest = async (buddy) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
      body: JSON.stringify({
        from: buddy,
        to: this.state.username,
      }),
    };
    try {
      let fetchResponse = await fetch(
        url + "/api/auth/accept_buddy_request/",
        data
      );
    } catch (e) {
      console.log(e);
    }
  };

  rejectBuddyRequest = async (buddy) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
      body: JSON.stringify({
        from: buddy,
        to: this.state.username,
      }),
    };
    try {
      let fetchResponse = await fetch(
        url + "/api/auth/reject_buddy_request/",
        data
      );
    } catch (e) {
      console.log(e);
    }
  };

  fetchBuddyRequest = async () => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: null,
      },
      body: JSON.stringify({
        user: this.state.username,
      }),
    };
    try {
      return fetch(url + "/api/auth/fetch_buddy_request/", data)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            buddy_requests: data.requests,
          });
          return data.requests;
        });
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  fetchBuddy = async () => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        user: this.state.username,
      }),
    };
    try {
      return fetch(url + "/api/auth/fetch_buddy/", data)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            buddies: data.requests,
          });
          return data.requests;
        });
    } catch (e) {
      console.log(e);
      return e
    }
  };

  getChats = async () => {
    const data = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: "Token " + this.state.token
        }
    };
    try {
      
        return fetch(url + "/api/messages/chats", data)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              chats: data,
            });
            
            return data;
          });
      } catch (e) {
        console.log(e);
        return e;
      }
  };



  getAllChatMessages = async (chat_id) => {
    const data = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Token " + this.state.token,
        }
    };
    try {
        return fetch(url + "/api/messages/all/" + chat_id, data)
          .then((response) => response.json())
          .then((data) => {
            this.setState({
              messageThread: data.messages,
            });
            return data.messages;
          });
      } catch (e) {
        console.log(e);
        return e;
      }
  };

  sendMessage = async (chat_id, msg_content) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        chat_id: chat_id,
        content: msg_content
      })
    };

    try {
      return fetch(url + "/api/messages/send", data)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  createChat = async (chatName, members) => {
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.state.token,
      },
      body: JSON.stringify({
        name: chatName,
        members: members
      })
    };

    try {
      return fetch(url + "/api/messages/create-chat/", data)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  sendRandomNonBuddyRequest = async () => {
    // sample-non-buddy/
    const data = {
      method: "GET",
      headers:{
        Authorization: "Token " + this.state.token,
      }
    };
    try{
      let fetchResponse = await fetch(url + "/api/auth/sample-non-buddy/", data);
      const respJson = await fetchResponse.json();
      if(Object.keys(respJson).includes("username")){
        console.log("sending a random buddy request to", respJson["username"]);
        this.sendBuddyRequest(respJson["username"])
      }
      else{
        this.noAvailableNonBuddyAlert(respJson["details"])
      }
      return respJson;
    }catch(e){
      console.log(e);
      this.displayNoConnectionAlert(e);
      return null;
    };
  }
  // Alerts
  displayNoConnectionAlert = (e) => {
    Alert.alert("Error", String(e), [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displayInvalidInfoAlert = () => {
    Alert.alert("Error", "Provided information incorrect, please try again", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displaySuccessAlert = () => {
    Alert.alert("Success!", "Your journey/quest is submitted successfully", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };


  displayGetJourneyAlert = () => {
    Alert.alert("Connection Error", "Failed to get journeys", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

      
  WrongPasswordAlert = () => {
    Alert.alert("Login Unsuccessful", "Wrong Username and/or Password", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displayCompleteJourneyAlert = () => {
    Alert.alert("Congratulations", "You've finished this journey! Feel free to go to Journey Market to start another one.", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displayCompleteQuestAlert = () => {
    Alert.alert("Congratulations", "You've finished today's quest!", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displayNoDailyQuestAlert = () => {
    Alert.alert("No Daily Quests", "Please start a new journey", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  displayThirdJourneyAlert = () => {
    Alert.alert("Third Journey", "You've already had two journeys in progress. Please finish them before you start a new one",
    [
      {
      text: "Close",
      style: "cancel",
      },
      {text:"Drop a journey"
      }
    ]);
  }

  displayActivateJourneyAlert = () => {
    Alert.alert("Journey Started", "You've successfully started this journey. Now you can start a quest on Daily Quest page.",
    [
      {text: "Close",
       style: "cancel",
      }
    ]
    );
  }

  displayDropJourneyAlert = () => {
    Alert.alert("Drop Journey", "Successfully",
    [
      {
      text: "Close",
      style: "cancel",
      },
    ]);
  }

  registerSuccessAlert = () => {
    Alert.alert(
      "Registration Successful",
      // Email confirmation taken out for now
      // "Please check your email inbox for a confirmation email",
      "Please try logging in",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  registerFailAlert = () => {
    Alert.alert(
      "Registration Unsuccessful",
      "An account is already registered with your email and/or username",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  buddyRequestSuccessAlert = (buddyName = null) => {
    if(buddyName == null){
      Alert.alert(
        "Buddy Request Successful",
        "An accountability buddy request has been sent!",
        [
          {
            text: "Close",
            style: "cancel",
          },
        ]
      );
    }
    else{
      Alert.alert(
        "Buddy Request Successful",
        `A buddy request to the user "${buddyName}" has been sent!`,
        [
          {
            text: "Close",
            style: "cancel",
          },
        ]
      );
    }
  };

  noAvailableNonBuddyAlert = (errorMessage) => {
      Alert.alert(
        `${errorMessage}`,
        [
          {
            text: "Close",
            style: "cancel",
          },
        ]
      );
    };

  alreadyBuddyRequestSuccessAlert = () => {
    Alert.alert("Already Buddies", "You two are already buddies!", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  noUserAlert = () => {
    Alert.alert("Buddy Request Unsuccessful", "The user does not exist", [
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  };

  nowBuddiesAlert = () => {
    Alert.alert(
      "Buddy Request Successful",
      "Your buddy also sent you a buddy request so you two are officially buddy!",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  SameNameAlert = () => {
    Alert.alert(
      "Buddy Request Unsuccessful",
      "You can't send a buddy request to yourself",
      [
        {
          text: "Close",
          style: "cancel",
        },
      ]
    );
  };

  render() {
    return (
      <NetworkContext.Provider
        value={{
          // User auth and info
          token: this.state.token,
          isAuthenticated: this.state.isAuthenticated,
          isLoading: this.state.isLoading,
          isAdmin: this.state.isAdmin,
          username: this.state.username,
          signUp: this.signUp,
          signIn: this.signIn,
          signOut: this.signOut,
          getUserMeta: this.getUserMeta,
          sendBuddyRequest: this.sendBuddyRequest,
          acceptBuddyRequest: this.acceptBuddyRequest,
          rejectBuddyRequest: this.rejectBuddyRequest,
          loadToken: this.loadToken,
          // Cached data and methods to retrieve them
          journeys: this.state.journeys,
          userInfo: this.state.userInfo,

          getJourneys: this.getJourneys,
          getIncompleteJourney: this.getIncompleteJourney,
      
          registerSuccess: this.state.registerSuccess,

          buddies: this.state.buddies,
          buddy_requests: this.state.buddy_requests,

          messageThread: this.state.messageThread,
          chats: this.state.chats,
          curr_chat_id: this.state.curr_chat_id,

          // Methods to retrieve non-cached data
          getJourneyInfo: this.getJourneyInfo,
          getJourneyProgress: this.getJourneyProgress,


          // Method to complete quest
          getActiveJourneys: this.getActiveJourneys,
          activateJourney: this.activateJourney,
          completeQuest: this.completeQuest,
          checkThirdJourney: this.checkThirdJourney,
          getAllQuests: this.getAllQuests,
          dropJourney: this.dropJourney,
          checkCompleteJourney: this.checkCompleteJourney,
          finishJourney: this.finishJourney,

          // methods to submit user-defined quest / journey
          uploadJourney: this.uploadJourney,
          submitQuest: this.submitQuest,

          // Alerts
          displayNoConnectionAlert: this.displayNoConnectionAlert,
          displayInvalidInfoAlert: this.displayInvalidInfoAlert,
          displayCompleteJourneyAlert: this.displayCompleteJourneyAlert,
          displayCompleteQuestAlert: this.displayCompleteQuestAlert,
          displayActivateJourneyAlert: this.displayActivateJourneyAlert,
          displayDropJourneyAlert: this.displayDropJourneyAlert,
          WrongPasswordAlert: this.WrongPasswordAlert,
          registerFailAlert: this.registerFailAlert,
          registerSuccessAlert: this.registerSuccessAlert,
          buddyRequestSuccessAlert: this.buddyRequestSuccessAlert,
          SameNameAlert: this.SameNameAlert,
          nowBuddiesAlert: this.nowBuddiesAlert,
          noUserAlert: this.noUserAlert,
          alreadyBuddyRequestSuccessAlert: this.alreadyBuddyRequestSuccessAlert,

          fetchBuddyRequest: this.fetchBuddyRequest,
          fetchBuddy: this.fetchBuddy,

          //Messages
          getChats: this.getChats,
          getAllChatMessages: this.getAllChatMessages,
          sendMessage: this.sendMessage,
          createChat: this.createChat,

          //Quest history
          fetchQuestHistory: this.fetchQuestHistory,

          //Send random buddy requests
          sendRandomNonBuddyRequest: this.sendRandomNonBuddyRequest,
        }}
      >
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}
