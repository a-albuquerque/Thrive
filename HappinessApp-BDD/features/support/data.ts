const crypto = require("crypto");

export const users: { [key: string]: any } = {
    normalUser0: {
        "username": "test_user",
        "email": "test_user@example.com",
        "password": "12345678",
        "firstname": "test_firstname",
        "lastname": "test_lastname",
        "age": 21,
        "sex": "M"
    },
    normalUser1: {
        "username": "test_user_1",
        "email": "test_user_1@example.com",
        "password": "12345678",
        "firstname": "test_firstname_1",
        "lastname": "test_lastname_1",
        "age": 22,
        "sex": "F"
    },
    normalUser2: {
        "username": "test_user_2",
        "email": "test_user_2@example.com",
        "password": "12345678",
        "firstname": "test_firstname_2",
        "lastname": "test_lastname_2",
        "age": 22,
        "sex": "M"
    },
    normalUser3: {
        "username": "test_user_3",
        "email": "test_user_3@example.com",
        "password": "12345678",
        "firstname": "test_firstname_3",
        "lastname": "test_lastname_3",
        "age": 22,
        "sex": "M"
    }
}

export const addRandomUser = (userIdentifier: string) => {
    users[userIdentifier] = generateRandomUser()
    return users[userIdentifier]
}

export const generateRandomString = (size = 20) => {
    return crypto.randomBytes(size).toString('hex');
}

const generateRandomUser = () => {
    return {
        "username": generateRandomString(),
        "email": `${generateRandomString()}@example.com`,
        "password": "12345678",
        "firstname": `${generateRandomString()}`,
        "lastname": `${generateRandomString()}`,
        "age": 22,
        "sex": "M"
    }
}

export const getUser = (userIdentifier: string): { [key: string]: any } | null => {
    return users[userIdentifier]
}