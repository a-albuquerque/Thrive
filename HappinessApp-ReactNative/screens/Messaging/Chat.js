import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Text,
    SafeAreaView
} from "react-native";
import { NetworkContext } from "../../contexts/Networking";

import { GiftedChat, Composer, Bubble } from 'react-native-gifted-chat'
import { LinearGradient } from 'expo-linear-gradient';

let intervalId = null;

const Chat = ({route}) => {
    const netContext = useContext(NetworkContext);
    const [messages, setMessages] = useState([]);

    const updateMessages = () => {
        // console.log("refreshed");
        netContext.getAllChatMessages(route.params.chat_id).then(updatedMessages=>{
            
            let chatMessages = [];
            for(let i = updatedMessages.length-1; i >= 0; i--){
                
                chatMessages.push(
                    {
                        _id: i,
                        text: updatedMessages[i].content,
                        createdAt: new Date(updatedMessages[i].time_sent),
                        user: updatedMessages[i].sender.username == netContext.username ? {_id: undefined, } : {_id: updatedMessages[i].sender.username, name: updatedMessages[i].sender.usermeta.firstname + " " + updatedMessages[i].sender.usermeta.lastname, name: updatedMessages[i].sender.usermeta.firstname + " " + updatedMessages[i].sender.usermeta.lastname}
                    }
                )
            }

            setMessages(chatMessages);
        });
    }

    useEffect(() => {

        updateMessages();

        intervalId = setInterval(() => {updateMessages()}, 5000);

        return () => {
            if(intervalId !== null){
                clearInterval(intervalId);
            }
        }

    }, []) 
    /* useEffect(() => {
        setMessages([
            {
                _id: 2,
                text: 'Are you excited for that new Batman movie? I hear it\'s good!',
                createdAt: new Date(2022, 2, 3, 5, 1, 0, 0),
                user: {
                    _id: 3,
                    name: 'Bob',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Batman_logo.jpg',
                },
            },
            {
                _id: 1,
                text: 'Hey there buddy!',
                createdAt: new Date(2022, 2, 3, 4, 32, 0, 0),
                user: {
                    _id: 2,
                    name: 'Elon Musk',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Elon_Musk_Royal_Society_%28cropped%29.jpg',
                },
            },
            
        ])
    }, []) */

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        netContext.sendMessage(route.params.chat_id, messages[0].text);
    }, [])

    // const [messages, setMessages] = useState([])


    // const onSend = useCallback((messages = []) => {
    //     setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    // }, [])

    const ChatComposer = (props) => {
        return (
        <Composer
            {...props}
            textInputProps={{
            ...props.textInputProps,
            blurOnSubmit: false,
            multiline: false,
            onSubmitEditing: () => {
                if (props.text && props.onSend) {
                props.onSend({ text: props.text.trim() }, true)
                }
            },
            }}
        />
        )
    }

    return (
        <LinearGradient
            colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.6, 0.75, 0.9]}
            style={styles.linearGradient}
        >
        <GiftedChat
            messages={messages}
            onSend={onSend} 
            renderComposer={ChatComposer}
            renderUsernameOnMessage={true}
            onInputTextChanged = {(text) => {
                if(text !== "" && intervalId !== null) {
                    // console.log("started typing, so stopping the interval");
                    clearInterval(intervalId);
                    intervalId = null;
                }
                else if(text === "" && intervalId === null){
                    // console.log("finished typing, so starting the interval");
                    intervalId = setInterval(() => {updateMessages()}, 5000);
                }
            }}
            
            renderBubble={props => {
                return (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                        left: {
                            backgroundColor: '#1319c3',
                        },
                        right: {
                            backgroundColor: '#3A13C3',
                        },
                        }}
                        textProps={{
                        style: {
                            color: "white",
                        },
                        }}
                        textStyle={{
                        left: {
                            color: 'white',
                        },
                        right: {
                            color: '#000',
                        },
                        }}
                        style={styles.container}
                  />
                );
            }}

            
            
        />

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    input: {
        width: "90%",
        fontSize: 18,
        fontWeight: "500",
        height: 55,
        backgroundColor: "white",
        color: "green",
        margin: 10,
        padding: 8,
        borderRadius: 14,
    },

    linearGradient: {
    flex: 1,
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
});

export default Chat;