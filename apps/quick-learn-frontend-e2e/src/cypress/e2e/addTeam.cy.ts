import { AddTeam } from '../test/AddTeam';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });

  it('Admin able to Add Team', () => {
    const addTeams = new AddTeam();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    addTeams.visitTeamPage().click();
    addTeams.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    addTeams.getUserTypeAdmin();
    addTeams.getPassword().type('Password@123');
    addTeams.getConfirmPassword().type('Password@123');
    addTeams.getSkillID();
    addTeams.submitAddTeamButton();
  });

  it('verify required field ', () => {
    const addTeams = new AddTeam();
    addTeams.fieldNameRequired();
    cy.get(':nth-child(1) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(2) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(3) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(5) > .mt-1').should(
      'have.text',
      'Password must be at least 8 characters long',
    );
  });

  it('verify field by passing only spaces', () => {
    const addTeams = new AddTeam();
    addTeams.validateFieldWithEmptySpaces();
    cy.get(':nth-child(1) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(2) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(5) > .mt-1').should(
      'have.text',
      'Password must be at least 8 characters long',
    );
  });
});
