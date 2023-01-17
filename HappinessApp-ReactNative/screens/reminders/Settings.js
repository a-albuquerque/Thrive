import "react-native-gesture-handler";
import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Pressable } from "react-native";
import { ListItem, Switch } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Settings extends React.Component {

    state = {
        enableNotification: false,
        isDateTimePickerVisible: false,
        notificationTime: moment({ hour: 17 }),
        identifier: null
    }

    scheduleNotification = async () => {
        const NotificationID = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Reminder",
                body: 'Complete your daily quest!',
            },
            trigger: {
                hour: this.state.notificationTime.hour(),
                minute: this.state.notificationTime.minute(),
                repeats: true
            },
        })

        this.state.identifier = NotificationID

    }

    cancelNotification = async () => {
        await Notifications.cancelScheduledNotificationAsync(this.state.identifier)
            .then(() => {
                console.log('Notification cancelled')
            })
            .catch(() => {
                console.log('Error cancelling notification')
            })

        this.state.identifier = null
    }
    enableNotification = value => {
        if (value) {
            if(this.state.identifier != null){
                this.cancelNotification()
            }
            this.scheduleNotification()
        }
        if (!value) {
            this.cancelNotification()
        }
        this.setState({
            enableNotification: value,
        });
    };

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.hideDateTimePicker();

        this.setState({
            notificationTime: moment(date),
        });

        if(this.state.enableNotification){
            if(this.state.identifier != null){
                this.cancelNotification()
            }
            this.scheduleNotification()
        }
    };

    saveData = async () => {
        await AsyncStorage.setItem('enableNotification', JSON.stringify(this.state.enableNotification))
            .then(() => {
                console.log('Saved state of notification')
            })
            .catch(() => {
                console.log('There was an error saving the state of the notification')
            })

        await AsyncStorage.setItem('notificationTime', JSON.stringify(this.state.notificationTime))
            .then(() => {
                console.log('Saved notification time')
            })
            .catch(() => {
                console.log('There was an error saving notification time')
            })

        // if (this.state.identifier != null) {
        await AsyncStorage.setItem('identifier', JSON.stringify(this.state.identifier))
            .then(() => {
                console.log('Saved notification idenitifer')
            })
            .catch(() => {
                console.log('There was an error saving notification identifer')
            })
        // }
    }

    getData = async () => {
        let values
        try {
            values = await AsyncStorage.multiGet(['enableNotification', 'notificationTime', 'identifier'])
        } catch (e) {
            // read error
        }
        console.log(values)
        if (JSON.parse(values[0][1]) != null && JSON.parse(values[1][1]) != null) {
            this.setState({
                enableNotification: JSON.parse(values[0][1]),
                notificationTime: moment(JSON.parse(values[1][1])),
                identifier: JSON.parse(values[2][1])
            })
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        this.saveData()
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.cardTitleView}>
                    <Text style={styles.cardTitle}>Add Reminder</Text>
                </View>
                <ListItem bottomDivider>
                    <ListItem.Title style={styles.titleStyle}>Notifications</ListItem.Title>
                    <Switch
                        value={this.state.enableNotification}
                        onValueChange={(value) => this.enableNotification(value)}
                    />
                </ListItem>
                <ListItem>
                    <Pressable onPress={this.showDateTimePicker}>
                        <ListItem.Title style={styles.titleStyle}> Time </ListItem.Title>
                        <Text style={{ opacity: 0.7 }}>{moment(this.state.notificationTime).format('LT')}</Text>
                    </Pressable>
                </ListItem>
                <DateTimePickerModal
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode="time"
                    is24Hour={false}
                    date={new Date(this.state.notificationTime)}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEFF0',
    },
    cardTitleView: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 8,
    },
    cardTitle: {
        fontSize: 15,
        color: '#585858',
        fontWeight: '600',
    },
    titleStyle: {
        fontSize: 20,
        color: '#585858',
    },
});