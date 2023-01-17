import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity, ScrollView,
} from "react-native";
import {NetworkContext} from "../../contexts/Networking";

const url = 'http://3.15.239.159:8000'

export default class ManageQuestScreen extends React.Component {

  static contextType = NetworkContext

  constructor(props) {
    super(props)
    this.state = {
      quest: this.props.route.params.quest
    }
  }

  deleteThisQuest = async() => {
    const { quest } = this.state
    const { navigation } = this.props

    const data = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + this.context.token
      },
    }
    try {
      let result = await fetch(url + '/api/quests/' + quest.id + '/', data)
      navigation.goBack()
    } catch (e) {
      this.context.displayNoConnectionAlert(e)
    }
  }

  displayDeletionAlert = () => {
    Alert.alert(
      "Deletion Alert",
      "Are you sure you want to delete this Quest? This quest may be a part of other journeys.\nYou can't undo this action.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: this.deleteThisQuest,
          style: "destructive"
        }
      ]
    );
  }

  render() {
    const { quest } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Text>{quest.name}</Text>
        <Text>{quest.description}</Text>

        <TouchableOpacity
          style={styles.addQuestButton}
          onPress={this.displayDeletionAlert}
        >
          <Text>Delete this Quest</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  addQuestButton: {
    width: '40%',
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 7,
    backgroundColor: "#22AAAA",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
