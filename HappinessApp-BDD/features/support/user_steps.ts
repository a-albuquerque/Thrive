import {Given, Then, When} from "@cucumber/cucumber";
import {getEndpoint} from "../../index";
import {resetSpec, spec} from "./steps";
import {addRandomUser, getUser} from "./data";
import pactum from "pactum";

function loginWithUser(userIdentifier: string) {
    let _user = getUser(userIdentifier)
    spec.withBody(_user)
    spec.post(getEndpoint('/auth/login/'))
}

function newRequestSetToken() {
    spec.response().should.have.jsonSchema({
        "type": "object",
        "properties": {
            "token": {
                "type": "string"
            }
        }
    });
    const token = spec.returns('token')
    console.log(token)
    resetSpec()
    // This is non-standard format (This is beyond my control due to various reasons)
    spec.withHeaders('Authorization', `Token ${token}`)
    return token
}

function registerWithUser(userIdentifier: string) {
    let _user = getUser(userIdentifier)
    spec.withBody(_user)
    spec.post(getEndpoint('/auth/register/'))
}

function registerSuccessful() {
    spec.response().should.have.status(200)
    spec.response().should.have.json({
        "response": "Please confirm your email address to complete the registration"
    });
}

When(/^Register with user (.*)$/, function (userIdentifier: string) {
    registerWithUser(userIdentifier)
});

When(/^Login with user (.*)$/, function (userIdentifier: string) {
    loginWithUser(userIdentifier)
});

When(/^Get all user chats$/, async function () {
    spec.get(getEndpoint('/messages/chats'))
    await spec.toss()
});

When(/^Start new request$/, function () {
    resetSpec()
    if (this.token) {
        spec.withHeaders('Authorization', `Token ${this.token}`)
    }
})

When(/^Create chat with (.*)$/, async function (userIdentifier: string) {
    const targetUser = getUser(userIdentifier)!
    const payload = {
        'name': `${targetUser['username']} & ${this.loggedIn.username}`,
        "members": [
            {"username": `${targetUser['username']}`}
        ]
    }
    spec.withBody(payload)
    spec.post(getEndpoint('/messages/create-chat/'))
    await spec.toss()
});

Then(/^Expect exactly 1 chat$/, function () {
    spec.response().should.have.status(200)
    spec.response().should.have.jsonLike('$V.length === 1')
})

Then(/^Expect chat created$/, function () {
    spec.response().should.have.status(200)
})

Given(/^a random user (.*)$/, async function (userIdentifier: string) {
    addRandomUser(userIdentifier)
    registerWithUser(userIdentifier)
    await spec.toss()
    registerSuccessful()
    resetSpec()
})

When(/^Login as (.*) with token$/, async function (userIdentifier: string) {
    loginWithUser(userIdentifier)
    await spec.toss()
    this.loggedIn = getUser(userIdentifier)
    this.token = newRequestSetToken()
})

When(/^Receive a token and start new request with token$/, function () {
    newRequestSetToken()
})

Then(/^Login should be successful$/, function () {
    spec.response().should.have.status(200)
    spec.response().should.have.jsonSchema({
        "type": "object",
        "properties": {
            "token": {
                "type": "string"
            }
        }
    });
});

Then(/^Expect unauthorized$/, function () {
    spec.response().should.have.status(401)
})

Then(/^Expect successful chat array$/, function () {
    spec.response().should.have.status(200)
    spec.response().should.have.jsonSchema({
        "type": "array"
    })
})

Then(/^Register should be successful$/, function () {
    // WTF is this backend implementation?
    // Why does it return 500 for known error and 200 with {response: Unsuccessful}
    registerSuccessful()
});