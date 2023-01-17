import {BASE_URL, getEndpoint} from "../../index";

const pactum = require('pactum');
const {Given, When, Then, Before, After} = require('@cucumber/cucumber');

export let spec = pactum.spec()

export const setSpec = (_spec: any) => {
    spec = _spec
}

export const resetSpec = () => {
    setSpec(pactum.spec())
}

Before(() => {
    resetSpec()
});

Given(/^I make a (.*) request to (.*)$/, function (method: string, endpoint: any) {
    spec[method.toLowerCase()](getEndpoint(endpoint));
});

Given(/^I set path param (.*) to (.*)$/, function (key: any, value: any) {
    spec.withPathParams(key, value);
});

Given(/^I set query param (.*) to (.*)$/, function (key: any, value: any) {
    spec.withQueryParams(key, value);
});

Given(/^I set basic authentication credentials (.*) and (.*)$/, function (username: any, password: any) {
    spec.withAuth(username, password);
});

Given(/^I set header (.*) to (.*)$/, function (key: any, value: any) {
    spec.withHeaders(key, value);
});

Given(/I set body to/, function (body: string) {
    try {
        spec.withJson(JSON.parse(body));
    } catch (error) {
        spec.withBody(body);
    }
});

Given(/^I upload file at (.*)$/, function (filePath: any) {
    spec.withFile(filePath);
});

Given(/^I set multi-part form param (.*) to (.*)$/, function (key: any, value: any) {
    spec.withMultiPartFormData(key, value);
});

When('Receive a response', async function () {
    await spec.toss();
});

Then('I expect response should have a status {int}', function (code: any) {
    spec.response().should.have.status(code);
});

Then(/^I expect response header (.*) should be (.*)$/, function (key: any, value: any) {
    spec.response().should.have.header(key, value)
});

Then(/^I expect response header (.*) should have (.*)$/, function (key: any, value: any) {
    spec.response().should.have.headerContains(key, value)
});

Then(/^I expect response should have a json$/, function (json: string) {
    spec.response().should.have.json(JSON.parse(json));
});

Then(/^I expect response should have a json at (.*)$/, function (path: any, value: string) {
    spec.response().should.have.json(path, JSON.parse(value));
});

Then(/^I expect response should have a json like$/, function (json: string) {
    spec.response().should.have.jsonLike(JSON.parse(json));
});

Then(/^I expect response should have a json like at (.*)$/, function (path: any, value: string) {
    spec.response().should.have.jsonLike(path, JSON.parse(value));
});

Then(/^I expect response should have a json schema$/, function (json: string) {
    spec.response().should.have.jsonSchema(JSON.parse(json));
});

Then(/^I expect response should have a json schema at (.*)$/, function (path: any, value: string) {
    spec.response().should.have.jsonSchema(path, JSON.parse(value));
});

Then(/^I expect response should have a body$/, function (body: any) {
    spec.response().should.have.body(body);
});

Then('I expect response should have {string}', function (handler: any) {
    spec.response().should.have._(handler);
});

Then(/^I store response at (.*) as (.*)$/, function (path: any, name: any) {
    spec.stores(name, path);
});

After(() => {
    spec.end();
});