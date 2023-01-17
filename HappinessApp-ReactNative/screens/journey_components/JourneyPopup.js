import React, { Component } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from "react-native";
import { NetworkContext } from "../../contexts/Networking";

// Component for the popup that will show when user selects a journey icon
class JourneyPopupComponent extends Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props)
    this.state = {
      completedQuests: [],
      skippedQuests: [],
      totalQuests: [],
      fetchedData: false
    };
  }

  onPopupClose = () => {
    this.setState({
      fetchedData: false
    })
    this.props.onClose();
  }

  componentDidUpdate = async () => {
    // prevent infinite loop on setState
    if (this.state.fetchedData)
      return
    
    if (this.props.show) {
      const { journey } = this.props;
      const journeyProgress = await this.context.getJourneyProgress(journey.id);
      const journeyInfo = await this.context.getJourneyInfo(journey.id);
      this.setState({
        completedQuests: journeyProgress.completed,
        skippedQuests: journeyProgress.skipped,
        totalQuests: journeyInfo.quests,
        fetchedData: true
      })
    }
  }

  render() {
    const { journey } = this.props; // Extract journey object from parent
    const { name, image, description } = journey; // Extract name, image, and description from journey object
    const { completedQuests, totalQuests } = this.state; // Extract completedQuests and totalQuests from state
    return (
      // Use Modal to create popup effect
      <Modal
        animationType="slide"
        visible={this.props.show}
        transparent={true}
        onRequestClose={this.onPopupClose}
      >
        {/*Create a touchable that will be in the backdrop of the modal that the user can tap to close popup */}
        <TouchableWithoutFeedback
          style={styles.closeScreen}
          onPress={this.onPopupClose}
        >
          {/*Center everything*/}
          <View style={styles.centeredView}>
            {/*The actual popup view*/}
            {/*Wrap popup view inside touchablewithoutfeedback so that if user presses it nothing will happen*/}
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                {/* Create a column to seperate image + title from description */}
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <Image style={styles.journeyIcon} source={image} />
                  <Text style={{ paddingTop: 5 }}>{name}</Text>
                  <Text style={[{ paddingTop: 2 }, { color: "#326295" }]}>
                    {completedQuests.length} / {totalQuests.length} Quests
                    Completed
                  </Text>
                </View>
                <View style={{ flexDirection: "column", flex: 1 }}>
                  {/* This is where the description for the journey will go */}
                  <Text style={{ padding: 10 }}>{description}</Text>

                  {/* Create row for the two buttons (close and begin) */}
                  <View style={[{ flexDirection: "row" }]}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={this.onPopupClose} // When close button is pressed call on parent to hide popup
                    >
                      <Text
                        style={
                          Platform.OS === "ios" ? styles.text : styles.text2
                        }
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.journeyButton}
                      onPress={() => this.props.onConfirm(journey)} // Move on to show journey branch
                    >
                      <Text
                        style={
                          Platform.OS === "ios" ? styles.text : styles.text2
                        }
                      >
                        Begin
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

// Styles for views, puttons, and modal
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
  },
  journeyIcon: {
    flex: 1,
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  journeyButton: {
    flex: 1,
    width: "40%",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#42A5F5",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  closeButton: {
    flex: 1,
    width: "40%",
    paddingTop: 10,
    justifyContent: "center",
    paddingBottom: 10,
    backgroundColor: "#D3D3D3",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  closeScreen: {
    flex: 1,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    paddingTop: 5,
    paddingBottom: 20,
  },
  text2: {},
});

export default JourneyPopupComponent;
