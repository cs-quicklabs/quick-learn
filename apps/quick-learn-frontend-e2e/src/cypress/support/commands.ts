/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

// Cypress.Commands.add('login', (email, password) => {
//   cy.request('GET', 'http://dev.learn.build-release.com/', {
//     email: 'super.admin@yopmail.com',
//     password: 'password@123P',
//     rememberMe: false,
//   }).then(function (response) {
//     expect(response.status).to.eq(200);
//     Cypress.env('token', response.body.token);
//   });
// });

// before(() => {
//   cy.request("GET", "http://dev.learn.build-release.com/", {
//     email: "super.admin@yopmail.com",
//     password: "password@123P",
//     rememberMe: false,
//   }).then((response) => {
//     expect(response.status).to.eq(200);
//     Cypress.env('token', response.body.token);

//     // Set the token in localStorage
//     window.localStorage.setItem('authToken', response.body.token);
//   });
// });
// beforeEach(() => {
//   // Reload token in localStorage before each test
//   cy.visit('/');
//   cy.window()});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
