import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
  } from "react-native";
  import { NetworkContext } from "../contexts/Networking";
  import { Card, Title, Paragraph, Button } from "react-native-paper";
  import { LinearGradient } from 'expo-linear-gradient';

class DropJourneyComponent extends Component {
    static contextType = NetworkContext;

    state = {
      incompleteJourney: this.props.incompleteJourney,
    };


    handleJourneyDrop = async(item) => {
        const resp = await this.context.dropJourney(item.id);
        if (resp != null) {
            if (this.state.incompleteJourney.length == 1 && item.id == this.state.incompleteJourney[0]) {
                this.setState({
                    incompleteJourney: []
                });
            }else if(this.state.incompleteJourney.length == 2 && item.id == this.state.incompleteJourney[0]){
                const j = this.state.incompleteJourney[1];
                this.setState({
                    incompleteJourney: [j]
                });
            }else if (this.state.incompleteJourney.length == 2 && item.id == this.state.incompleteJourney[1]){
                const j = this.state.incompleteJourney[0];
                this.setState({
                    incompleteJourney: [j]
                });
            };
        };
    };

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    renderItem = ({ item }) => (
        <Card style={JourneyStyles.cardContainer}>
          <Card.Content>
            <View> 
            <Text style={styles.title}>{item.name}</Text>
            </View>

            <View> 
            <Paragraph style={styles.paragraph} numberOfLines={4}>{item.description}</Paragraph>
            </View>
          </Card.Content>
          <Card.Actions
            style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}
          >
            <Button
              labelStyle={{ fontSize: 16 , color: "#561d70"}}
              onPress={() => this.handleJourneyDrop(item)}
            >
              Drop
            </Button>
          </Card.Actions>
        </Card>
      );

    render(){
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
                    <View style={styles.line} />
                    <Text style={styles.Heading}>
                        Current Journeys
                    </Text>
                      <FlatList
                      nestedScrollEnabled
                      data={this.props.incompleteJourney}
                      keyExtractor={(item) => item.name}
                      renderItem={this.renderItem}
                    />

                    <Button
                        autoCapitalize="none"
                        style={styles.backButton}
                        title='continue'
                        mode="contained"
                        // dark='true'
                        onPress={() => this.props.onBack()}>
                        <Text style={styles.submitButtonText}> Back to Daily Quest </Text>
                    </Button>

                </View>
            </SafeAreaView>
            </LinearGradient>
        );
    }
}

// Journey styles
const JourneyStyles = StyleSheet.create({
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
    marginBottom: 20,
    width: "70%",
    alignSelf: "center",
    borderRadius: 50
    },
    backButtonText:{
      color: "white",
      fontSize: 15
    },
    container: {
      flex: 1,
      alignItems: "center",
    },
    Heading: {
      fontSize: 30,
      textAlign: "center",
      margin: 15,
    },
    ButtonContainer: {
      flexDirection: "row",
      alignItems: "stretch",
      flexWrap: "wrap",
    },
    line: {
      backgroundColor: "transparent",
      height: 10,
      width: "100%",
      position: "absolute",
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

  export default DropJourneyComponent;
  