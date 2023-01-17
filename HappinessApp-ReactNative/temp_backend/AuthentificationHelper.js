import AsyncStorage from "@react-native-async-storage/async-storage";

// Class with helper functions for getting token, token will be used so that if a user is already logged in from a previous session they can log in again easily

// Helper function to return token from asyncstorage, this'll be used to check if a user closes the app but is already logged in, let them skip the login screen
export let getAccesToken = async () => {
    let token: any = await AsyncStorage.getItem('token')
    return token
}

// Helper function to return user object from asyncstorage. Will be used to check if credentials are correct upon login
export let getUser = async () => {
    let user: any = await AsyncStorage.getItem('user')
    return JSON.parse(user)
}

// Helper function to set token and user object. Will be used when user first signs up
export const SetAccessToken = async (token: string, user: {} = {
    name: undefined,
    email: undefined,
    password: undefined,
    phone_number: undefined
}) => {
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('user', JSON.stringify(user))
};