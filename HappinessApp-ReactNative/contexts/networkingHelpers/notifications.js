import React, {Platform} from 'react-native'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const url = "https://thriveapp.pythonanywhere.com";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Can use this function below, OR use Expo's Push Notification
// Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: {data: 'goes here'},
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerNotificationToken(expoPushToken, userToken) {
    // await fetch(`https://dev.bellwoods.muddy.ca/notification/legacy/register?legacy_user_token=${userToken}`
    //     , {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             notification_token: expoPushToken, token_type: Platform.OS
    //         })
    //     }).then(response => response.json())
    //     .then(data => console.log(data));
    await fetch(url + "/api/auth/set-expo-token/",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Token " + userToken,
            },
            body: JSON.stringify({
                expo_token: expoPushToken
            })
        }).then(response => response.json())
        .then(data => console.log(data))
}

export async function registerForPushNotificationsAsync(userToken) {
    console.log("Registering for push notification")
    let token;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        await registerNotificationToken(token, userToken)
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
