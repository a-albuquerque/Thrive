import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Text
} from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import { NetworkContext } from "../contexts/Networking";
import { LinearGradient } from 'expo-linear-gradient';


export default class Playground extends React.Component{
    static contextType = NetworkContext;

    componentDidMount= async() => {
        this._unsubscirbe  = this.props.navigation.addListener("focus", () => {
            
        });
    };

    renderItem = ({item}) => (
        <Card style={[cardStyles.cardContainer]}>
        <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.title}>{item.name}</Text>
          <Title style={{ fontSize: 15, flex: 1 }}>{item.difficulty} ★ </Title>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Paragraph style={{ fontWeight: "bold" }}>Estimated Time: </Paragraph>
          <Paragraph>{item.estimated_time} Minutes </Paragraph>
        </View>

        <Paragraph style={{ fontWeight: "bold" }}>Instructions</Paragraph>
        <Paragraph style={styles.paragraph} numberOfLines={4}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions
        style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}
      >
        <Button
          labelStyle={{ fontSize: 14, color: "#561d70"}}
          onPress={() => this.props.navigation.navigate("Quest", {quest: item, journey: null})}
        >
          Start Quest
        </Button>
      </Card.Actions>
        </Card>
    );

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
            <View style={MIStyles.MIContainer}>
                <FlatList
                nestedScrollEnabled
                data={this.props.allQuests}
                keyExtractor = {(item) => item.name}
                renderItem={this.renderItem}
                ></FlatList>
    
               <Button
                autoCapitalize="none"
                style={styles.submitButton}
                title='continue'
                mode="contained"
                // dark='true'
                onPress={() => this.props.onBack()}>
                <Text style={styles.submitButtonText}> Back to Daily Quest </Text>
               </Button>


            </View>
            </SafeAreaView>
            </LinearGradient>
        )
    }
};

const styles = StyleSheet.create({
    linearGradient: {
    flex: 1,
    alignItems: "center",
    },
    title:{
      marginRight: 20,
      marginTop: 5,
    fontSize: 18,
    color: "#561d70",
    fontWeight: 'bold'
    },
    paragraph:{
    color: "black",
    fontSize: 12
    },
    backButton:{
    marginTop: 50,
    marginBottom: 50,
    marginVertical: 10,
    width: "70%",
    alignSelf: "center",
    borderRadius: 50
    },
    backButtonText:{
      color: "white",
      fontSize: 15
    },
    play:{
      opacity: 0.8,
      position: "absolute",
      top: 35,
      left: 185,
      backgroundColor: "transparent",
      color: 'white',
    },
    container: {
      flex: 1,
      alignItems: "center",
    },
    image: {
      width: 425,
      height: 150,
      resizeMode: "stretch",
    },
    journeyButton: {
      width: 200,
      marginRight: 40,
      marginLeft: 40,
      marginTop: 10,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: "transparent",
      borderRadius: 30,
      borderColor: "#fff",
      alignItems: "center",
    },
    backButton: {
      width: 200,
      marginRight: 40,
      marginLeft: 40,
      marginTop: 2,
      marginBottom: 2,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: "transparent",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "#fff",
      alignItems: "center",
    },
    centerView: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      flex: 9,
      flexDirection: "column",
      width: "100%",
    },
    scrollContents: {
      alignItems: "center",
    },
    heading: {
      fontSize: 32,
      color: "#6A8099",
      textAlign: "center",
      fontWeight: "bold",
      margin: 15,
    },
  
    heading2: {
      fontSize: 16,
      color: "#7E6847",
      textAlign: "center",
    },
  
    text: {
      fontSize: 16,
      color: "#27214D",
      textAlign: "center",
      margin: 2,
    },
  });
  
  const MIStyles = StyleSheet.create({
    MIContainer: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "transparent",
    },
    MITextContainer: {
      marginHorizontal: 10,
      marginTop: 10,
    },
    MIDescriptionText: {
      fontSize: 20,
      textAlign: "center",
    },
    MIPicture: {
      width: "100%",
      height: 200,
    },
    MIPictureContainer: {
      flexDirection: "row",
      justifyContent: "center",
      margin: 10,
    },
    MIButtonContainer: {
      // justifyContent: "center",
      marginBottom: 15,
      flex: 1,
      justifyContent: "flex-end",
    },
    MIButton: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "blue",
    },
  });
  
  const cardStyles = StyleSheet.create({
    cardContainer: {
      margin: 10,
      marginHorizontal: 10,
      padding: 10,
      shadowRadius: 15,
      backgroundColor: "#edf7f5",
      elevation: 4,
      minWidth: "90%",
    },
  });