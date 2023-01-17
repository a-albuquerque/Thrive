import "react-native-gesture-handler";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity, FlatList, Alert,
} from "react-native";
import {NetworkContext} from "../../contexts/Networking";

export default class ManageAllJourneysScreen extends React.Component {

  static contextType = NetworkContext

  constructor(props) {
    super(props);
    this.state = {
      journeys: []
    }
  }

  getJourneys = async () => {
    await this.context.getJourneys()
    this.setState({
      journeys: this.context.journeys
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getJourneys()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    const { navigation } = this.props
    const { journeys } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollView}>
          <ScrollView
            contentContainerStyle={styles.scrollContents}
          >
            <Text>All journeys:</Text>
            <Text>Tap on the journey to review it</Text>
            {journeys.map((journey) => (
              <JourneyListItem
                key={journey.id}
                navigation={navigation}
                journeyInfo={journey}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("Create Journey")}
            >
              <Text>+ Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

class JourneyListItem extends React.Component {
  render() {
    const { name, description } = this.props.journeyInfo
    const { navigate } = this.props.navigation
    return(
      <View style={styles.journeyListEntryContainer}>
        <TouchableOpacity
          style={styles.journeyList}
          onPress={() => navigate('Manage Journey', {'journey': this.props.journeyInfo})}
        >
          <Text>{name}: {description}</Text>
        </TouchableOpacity>
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
  bottomButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomButtons: {
    flex: 1,
    width: '45%',
    alignItems: 'center'
  },
  addButton: {
    width: '90%',
    height: 50,
    marginTop: 7,
    backgroundColor: "#22AAAA",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyListEntryContainer: {
    flex: 1,
    width: '93%',
    alignItems: "center",
    justifyContent: "center",
  },
  journeyList: {
    flex: 1,
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    backgroundColor: "#C9DBC5",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  }
});
