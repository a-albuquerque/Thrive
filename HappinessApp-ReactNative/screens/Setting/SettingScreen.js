import "react-native-gesture-handler";
import React, {useContext, useEffect, useState} from "react";
import {
    Image, StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import {NetworkContext} from "../../contexts/Networking";
import {LinearGradient} from 'expo-linear-gradient';
import CheckBox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {setAddState} from "../../utils/utils";
import {Snackbar} from "react-native-paper";
import DropDownPicker from 'react-native-dropdown-picker';


const TitleButton = ({text, selected, setSelected}) => {
    const s = selected.toLowerCase() === text.toLowerCase()
    return (
        <TouchableOpacity style={[styles.titleButton, s ? styles.selectedButton : {}]}
                          onPress={() => setSelected(text)}>
            <Text style={{color: s ? "white" : "black", fontWeight: "bold"}}>{text}</Text>
        </TouchableOpacity>
    )
}


export default function SettingScreen() {
    const context = useContext(NetworkContext)
    const [selectedButton, setSelectedButton] = useState("preferences")
    const [notificationPreferences, setNotificationPreferences] = useState({})
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarAction, setSnackbarAction] = React.useState(async () => {
    });
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarButton, setSnackbarButton] = React.useState("");

    const SettingCheckBox = ({text, notification_key, children}) => {
        return (
            <View style={styles.checkBoxContainer}>
                <CheckBox
                    value={notificationPreferences[notification_key]}
                    onValueChange={(value) => {
                        setAddState(notification_key, value, notificationPreferences, setNotificationPreferences)
                    }}
                    style={styles.checkbox}
                    color={"#000000"}
                />
                <Text style={styles.notificationText}>{text}</Text>
                {children}
            </View>
        )
    }

    const saveNotificationPreferences = async () => {
        try {
            console.log("Saving notification preferences")
            const res = await fetch(`https://dev.bellwoods.muddy.ca/notification/legacy?legacy_user_token=${context.token}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notificationPreferences)
                }
            )
            console.log(await res.json())
            setSnackbarVisible(true)
            setSnackbarText("Saved Successfully")
        } catch (e) {
            setSnackbarVisible(true)
            setSnackbarText("Unable to save user notifications")
            setSnackbarAction(saveNotificationPreferences)
            setSnackbarButton("Save Again")
        }
    }
    const fetchNotificationPreferences = async () => {
        try {
            console.log("Beginning notification preferences fetch")
            const res = await fetch(`https://dev.bellwoods.muddy.ca/notification/legacy?legacy_user_token=${context.token}`, {method: "GET"})
            const response = await res.json()
            setNotificationPreferences(response)
        } catch (e) {
            console.log("error")
            // The current pythonanywhere deployment can timeout
            setSnackbarVisible(true)
            setSnackbarText("Unable to fetch user notifications")
            setSnackbarAction(fetchNotificationPreferences)
            setSnackbarButton("Reload")
        }
    }
    useEffect(() => {
        fetchNotificationPreferences().then()
    }, [])

    const getJSDateFromTime = (data) => { // data: 00:00:00 string
        const parts = data.split(':')
        // using string parse can cause timezone issues
        return new Date(1950, 0, 1, parts[0], parts[1], parts[2])
    }
    return (
        <LinearGradient
            colors={["#c1cdf5", '#f7e4ed', '#c1cdf5', '#F9E5E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.6, 0.75, 0.9]}
            style={styles.linearGradient}
        >
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        colors={['rgba(249, 229, 232, 0.3)', 'rgba(151, 225, 212, 0.3)', 'rgba(255, 114, 182, 0.3)']}
                        style={styles.container}>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                action={{
                    label: snackbarButton,
                    onPress: {snackbarAction},
                }}>
                {snackbarText}
            </Snackbar>

            <Image
                source={{uri: 'https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png'}}
                style={styles.avatar}
            />

            <View style={styles.buttonGroup}>
                <TitleButton text={"Preferences"} selected={selectedButton} setSelected={setSelectedButton}/>
                <TitleButton text={"About"} selected={selectedButton} setSelected={setSelectedButton}/>
            </View>

            <View style={styles.notificationContainer}>
                <Text style={styles.settingHeader}>Notifications</Text>
                <SettingCheckBox text={'Notify me when someone sent a friend request'}
                                 notification_key={"friend_request"}/>
                <SettingCheckBox text={'Notify me when my buddy has finished a journey'}
                                 notification_key={"buddy_finish_journey"}/>
                <SettingCheckBox text={'Start to notify me when a journey is due in less than'}
                                 notification_key={"journey_due_in"}/>
                <View style={{flexDirection: "row"}}>
                    <TextInput
                        style={styles.input}
                        value={(notificationPreferences["journey_due_in_time"]/86400).toString()}
                        onChangeText={(text)=>{
                            setAddState("journey_due_in_time", text * 86400 || 0,
                                notificationPreferences, setNotificationPreferences)
                        }}
                        keyboardType={"numeric"}
                    />
                    <Text style={[styles.notificationText,{marginLeft: 10, alignSelf: "center"}]}>Days</Text>
                </View>
                <SettingCheckBox text={'Give me a summary of journeys at'}
                                 notification_key={'journey_daily_summary'}
                                 children={<TouchableOpacity
                                     style={styles.dateTimeButton}
                                     onPress={() => {
                                     setShowDateTimePicker(true)
                                 }}>
                                     <Text style={[styles.notificationText,{marginLeft: 0}]}>{notificationPreferences["journey_daily_summary_time"]}</Text>
                                 </TouchableOpacity>
                }/>


                {showDateTimePicker && <DateTimePicker
                    testID="dateTimePicker"
                    value={getJSDateFromTime(notificationPreferences['journey_daily_summary_time'])}
                    mode={'time'}
                    is24Hour={true}
                    display="clock"
                    onChange={(event, selectedDate) => {
                        console.log(getJSDateFromTime(notificationPreferences['journey_daily_summary_time']))
                        setShowDateTimePicker(false)
                        const _data = selectedDate || getJSDateFromTime(notificationPreferences['journey_daily_summary_time'])
                        setAddState("journey_daily_summary_time",
                            `${_data.getHours()}:${_data.getMinutes()}:${_data.getSeconds()}`,
                            notificationPreferences, setNotificationPreferences)
                    }}
                />}
            </View>

            <TouchableOpacity style={[styles.titleButton, styles.bottomSaveButton]} onPress={async () => {
                await saveNotificationPreferences()
            }}
            >
                <Text style={styles.saveButtonText}>SAVE</Text>
            </TouchableOpacity>
        </LinearGradient>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: "center",
    },
    dateTimeButton: {
        borderRadius: 4,
        borderWidth: 1.5,
        alignItems: "center",
        marginLeft: 5,
        paddingHorizontal: 5
    },
    notificationText: {
        marginLeft: 10,
        fontWeight: "bold",
        fontSize: 15
    },
    input: {
        height: 40,
        borderWidth: 2,
        padding: 10,
        borderRadius: 4,
        width: 40
    },
    settingHeader: {
        fontWeight: "bold",
        color: "#561d70",
        fontSize: 18
    },
    saveButtonText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 15
    },
    bottomSaveButton: {
        marginTop: "auto",
        marginBottom: 25,
        width: "95%",
        borderRadius: 5,
        borderWidth: 0,
        backgroundColor: "#8688BC",
        padding: 20
    },
    checkBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    checkbox: {
        alignSelf: "center",
    },
    notificationContainer: {
        width: '95%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 2,
    },
    selectedButton: {
        backgroundColor: "#000000",
        color: "#ffffff"
    },
    titleButton: {
        alignItems: "center",
        borderWidth: 2,
        padding: 7,
        borderRadius: 90,
        marginLeft: 20,
        marginRight: 20,
        width: 130
    },
    buttonGroup: {
        flexDirection: 'row',
        marginBottom: 20
    },
    container: {
        flex: 1,
        alignItems: "center"
    },
    avatar: {
        width: 160, height: 160, borderRadius: 160 / 2, margin: 20
    }
});