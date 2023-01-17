import React from "react";
import { NetworkContext } from "../contexts/Networking";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    FlatList,
    View
  } from "react-native";

import { LinearGradient } from 'expo-linear-gradient';

export default class History extends React.Component {
    static contextType = NetworkContext;
    state = {
        questsList: [
     
        ]
    }

    
    getHistory = async () => {
        let history = await this.context.fetchQuestHistory();
        console.log(history)
        this.createHistoryEntries(
            history.completed
        )
        
    }

    createHistoryEntries = async (historyObjs) => {
        let newQuestList = []
        let id = 0
        for(let obj of historyObjs){
            let dateObj = new Date(Date.parse(obj.timestamp))
            newQuestList.push(
                {
                    id: id,
                    quest: obj.quest.name,
                    journey: obj.journey.name,
                    timestamp: dateObj
                }
            )
            id++;
        }
        this.setState({...this.state, questsList: newQuestList })
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener("focus", () => {
          this.getHistory();
        });
        
    }
    log(i){
        console.log(i)
    }
    render() {
        this.state.questsList.sort(function(quest1,quest2){
            if(quest1.timestamp.getTime() < quest2.timestamp.getTime()){
                return 1;
            }
            if(quest1.timestamp.getTime() > quest2.timestamp.getTime()){
                return -1;
            }
            else{
                return 0;
            }
        })
        return (
            <LinearGradient
            colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.6, 0.75, 0.9]}
            style={styles.linearGradient}
            >
            <SafeAreaView >
                <FlatList data={this.state.questsList} keyExtractor={quest=>quest.id} renderItem={(quest) => (
                    <View>
                        <Quest quest={quest.item.quest} journey={quest.item.journey} timestamp={quest.item.timestamp} />
                    </View>
                    )}>
                    
                </FlatList>
            </SafeAreaView>
            </LinearGradient>
        );
      }
}

class Quest extends React.Component{
    render(){
        const {quest, journey, timestamp} = this.props
        return(
            <View style={styles.quest}>
                <View style={styles.text}>
                <Text style={styles.title}>{journey}</Text>

                </View>
                <View>
                <Text style={styles.paragraph}>{quest}</Text>

                </View>
                <View style={{alignItems:"flex-end"}}>
                <Text>{timestamp.toDateString()}</Text>

                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    quest:{
        padding: 15,
        backgroundColor:"rgba(184,223,216,0.9)",
        borderBottomWidth: 2,
        borderColor:"rgba(68,85,90,0.4)",
        
    },

    linearGradient: {
        flex: 1,
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
        fontSize: 12,
        textAlign: "center",
        marginTop: 2
    },
})