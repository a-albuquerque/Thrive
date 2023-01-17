import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

import {JourneyListItem} from "./ManageAllJourneysScreen";
import {NetworkContext} from "../../contexts/Networking";

const url = 'http://3.15.239.159:8000'

export default class ManageJourneyScreen extends React.Component {

  static contextType = NetworkContext

  constructor(props) {
    super(props)
    this.state = {
      journey: this.props.route.params.journey,
      quests: this.props.route.params.journey.quests,
      removedQuests: [],
      editMode: false,
    }
  }

  onEdit = () => {
    this.setState({
      editMode: true
    })
  }

  onDone = async () => {
    this.setState({
      editMode: false
    })
    // Delete removed quests
    for (let i = 0; i < this.state.removedQuests.length; i++) {
      const questId = this.state.removedQuests[i]
      this.deleteQuest(questId)
      console.log('deleting quest ', questId)
    }

    // Reorder
    let reorderedString = ""
    for (let i = 0; i < this.state.quests.length; i++) {
      const questId = this.state.quests[i].id
      reorderedString += questId + ','
    }
    // Remove last comma
    reorderedString = reorderedString.slice(0, -1);

    const data = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.context.token,
      }
    }

    const journeyId = this.state.journey.id
    try {
      let fetchResponse = await fetch(url + "/api/journeys/" +
        journeyId + "/reorder-quests?ids=" + reorderedString, data);
      let respJson = await fetchResponse.json();
      console.log(respJson)
    } catch (e) {
      console.log(e)
      this.context.displayNoConnectionAlert(e);
    }
  }

  deleteQuest = async (questId) => {
    const journeyId = this.state.journey.id
    const data = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + this.context.token,
      }
    }
    try {
      let fetchResponse = await fetch(url + "/api/journeys/" +
        journeyId + '/quests/' + questId + '/', data);
      let respJson = await fetchResponse.json();
    } catch (e) {
      console.log(e)
      this.context.displayNoConnectionAlert(e);
    }
  }

  getJourneyInfo = async () => {
    const {journey} = this.state
    let fetchedJourney = await this.context.getJourneyInfo(journey.id)
    this.setState({
      journey: fetchedJourney,
      quests: fetchedJourney.quests,
    })
  }

  deleteThisJourney = async() => {
    const { journey } = this.state
    const { navigation } = this.props
    try {
      await fetch(url + '/api/journeys/' + journey.id + '/', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Token ' + this.context.token
        },
      })

      navigation.goBack()
    } catch(e) {
      this.context.displayNoConnectionAlert(e)
    }
  }

  displayDeletionAlert = () => {
    Alert.alert(
      "Deletion Alert",
      "Are you sure you want to delete this Journey?\nYou can't undo this action.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: this.deleteThisJourney,
          style: "destructive"
        }
      ]
    );
  }

  onMoveQuestUp = (questId) => {
    let updatedList = []
    let isFirst = true
    for (let quest of this.state.quests) {
      if (quest.id === questId && isFirst) {
        return
      }
      if (quest.id === questId) {
        let prevQuest = updatedList.pop()
        updatedList.push(quest)
        updatedList.push(prevQuest)
        continue
      }

      updatedList.push(quest)
      isFirst = false
    }
    this.setState({
      quests: updatedList
    })
  }

  onMoveQuestDown = (questId) => {
    let updatedList = []
    let questToMove = null
    for (let i = 0; i < this.state.quests.length; i++) {
      let quest = this.state.quests[i]

      if (quest.id === questId && i === this.state.quests.length - 1) {
        return
      }

      if (quest.id === questId) {
        questToMove = quest
        continue
      }

      updatedList.push(quest)
      if(questToMove) {
        updatedList.push(questToMove)
        questToMove = null
      }
    }
     this.setState({
      quests: updatedList
    })
  }

  onRemoveQuest = (questId) => {
    let updatedList = []
    let removedQuests = this.state.removedQuests
    for (let quest of this.state.quests) {
      if (quest.id === questId) {
        removedQuests.push(quest.id)
        continue
      }
      updatedList.push(quest)
    }
    this.setState({
      quests: updatedList,
      removedQuests: removedQuests
    })
    console.log(this.state)
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getJourneyInfo()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    const { navigate } = this.props.navigation
    const { journey, quests } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollView}>
          <ScrollView
            contentContainerStyle={styles.scrollContents}
          >
            <View style={styles.journeyDescriptionContainer}>
              <View style={styles.journeyDescriptionTitleContainer}>
                <Text style={styles.journeyDescriptionTitle}>{journey.name}</Text>
              </View>
              <Text style={styles.journeyDescriptionBody}>{journey.description}</Text>
              <View style={styles.horizontalSeparatorLine}/>
              <Text style={styles.text}>All quests:</Text>
              <Text style={styles.text}>Tap on the quest to review it</Text>
            </View>
            {quests.length ?
              (quests.map((quest) => (
                <QuestListItem
                  key={quest.id}
                  navigation={this.props.navigation}
                  questInfo={quest}
                  onMoveUp={this.onMoveQuestUp}
                  onMoveDown={this.onMoveQuestDown}
                  onRemove={this.onRemoveQuest}
                  edit={this.state.editMode}
                />))
              ) : (
                <Text>Failed to load quests. Check your connection</Text>
              )
            }
          </ScrollView>
        </View>
        {(this.state.editMode) ?
          (<View style={styles.bottomButtonsContainer}>
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.addQuestButton}
                onPress={() => {}}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.addQuestButton}
                onPress={this.onDone}
              >
                <Text>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deleteButton}>
              <TouchableOpacity
                style={styles.addQuestButton}
                onPress={this.displayDeletionAlert}
              >
                <FontAwesome name='trash-o' size={22} color='black'/>
              </TouchableOpacity>
            </View>
          </View>)
          :
          (<View style={styles.bottomButtonsContainer}>
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.addQuestButton}
                onPress={() => navigate("Create Quest", {'journey': journey})}
              >
                <Text>+ Quest</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.addQuestButton}
                onPress={this.onEdit}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>)
        }
      </SafeAreaView>
    );
  }
}

export class QuestListItem extends React.Component {

  onMoveUp = () => {
    const {id} = this.props.questInfo
    this.props.onMoveUp(id)
  }

  onMoveDown = () => {
    const {id} = this.props.questInfo
    this.props.onMoveDown(id)
  }

  onRemove = () => {
    const {id} = this.props.questInfo
    this.props.onRemove(id)
  }

  render() {
    const { name, description } = this.props.questInfo
    const { navigate } = this.props.navigation
    const { edit } = this.props
    return(
      <View style={styles.questListEntryContainer}>
        {edit && (
          <View style={styles.removeIcon}>
            <TouchableOpacity
              // style={styles.}
              onPress={this.onRemove}
            >
              <MaterialIcons name='remove-circle-outline' size={28} color='red'/>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.questListEntryTitle}
          onPress={() => navigate('Manage Quest', {'quest': this.props.questInfo})}
        >
          <Text style={styles.text}>{name}: {description}</Text>
        </TouchableOpacity>

        {edit &&
          (<View style={styles.questListOrderButtonsContainer}>
            <TouchableOpacity
              style={styles.questListOrderButton}
              onPress={this.onMoveUp}
            >
              <FontAwesome name='arrow-circle-o-up' size={28}/>

            </TouchableOpacity>
            <TouchableOpacity
              style={styles.questListOrderButton}
              onPress={this.onMoveDown}
            >
              <FontAwesome name='arrow-circle-o-down' size={28}/>
            </TouchableOpacity>
          </View>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollView: {
    flex: 9,
    flexDirection: 'column',
    width: '100%',
  },
  scrollContents: {
    alignItems: 'center',
  },
  journeyDescriptionContainer: {
    width: '90%',
    alignItems: 'center',
  },
  journeyDescriptionTitleContainer: {
    marginTop: 8,
    marginBottom: 5,
    backgroundColor: '#badede',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
  },
  journeyDescriptionTitle: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  journeyDescriptionBody: {
    fontSize: 18
  },
  bottomButtonsContainer: {
    flex: 1,
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomButtons: {
    flex: 3,
    alignItems: 'center'
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center'
  },
  addQuestButton: {
    width: '90%',
    height: 50,
    backgroundColor: "#22AAAA",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  questListEntryContainer: {
    flex: 1,
    width: '93%',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  },
  questListEntryTitle: {
    flex: 9,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 11,
    paddingRight: 11,
    marginTop: 10,
    backgroundColor: "#C9DBC5",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
  questListOrderButtonsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  questListOrderButton: {
    flex: 1,
    justifyContent: 'center'
  },
  removeIcon: {
    flex: 1,
  },
  text: {
    fontSize: 16
  },
  horizontalSeparatorLine: {
    width: '100%',
    borderBottomColor: '#7a7a7a',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
});
