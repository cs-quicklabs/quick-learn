import { AddTeam } from '../test/AddTeam';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify Super Admin should able to Add New Team Member', () => {
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

  it('Verify that validation is set for all the mandatory fields ', () => {
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

  it('Verify Team member is not getting added on passing only spaces', () => {
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
    cy.get(':nth-child(3) > .mt-1').should(
      'have.text',
      'This field is required',
    );
    cy.get(':nth-child(5) > .mt-1').should(
      'have.text',
      'Password must be at least 8 characters long',
    );
  });
  it('Verify user not able to set password when New and Confirm password mismatch', () => {
    const addTeams = new AddTeam();
    addTeams.EnterPasswordWithDifferentNewAndConfirmPassword();
  });

  it('Verify user not able to update password when password is small', () => {
    const addTeams = new AddTeam();
    addTeams.UpdatePasswordWithLesserLength();
  });

  it('Verify User should not able to update password with invalid data', () => {
    const addTeams = new AddTeam();
    addTeams.SetInvalidPassword();
  });

  it('Verify User should not able to Add a team member with incorrect data', () => {
    const addTeams = new AddTeam();
    addTeams.InvalidDataTest();
  });

  it('Verify Add button remains disabled if no user role is selected', () => {
    const addTeams = new AddTeam();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    addTeams.visitTeamPage().click();
    addTeams.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    cy.get('#user_type_id').should('be.visible');
    addTeams.getPassword().type('Password@123');
    addTeams.getConfirmPassword().type('Password@123');
    addTeams.getSkillID();
    cy.get('#submit').should('be.disabled');
  });

  it('Verify Add button remains disabled if no primary skill is selected', () => {
    const addTeams = new AddTeam();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    addTeams.visitTeamPage().click();
    addTeams.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    addTeams.getUserTypeEditor();
    addTeams.getPassword().type('Password@123');
    addTeams.getConfirmPassword().type('Password@123');
    cy.get('#skill_id').should('be.visible');
    cy.get('#submit').should('be.disabled');
  });

  it('Verify Super Admin should able to Add New Editor role', () => {
    const addTeams = new AddTeam();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    addTeams.visitTeamPage().click();
    addTeams.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    addTeams.getUserTypeEditor();
    addTeams.getPassword().type('Password@123');
    addTeams.getConfirmPassword().type('Password@123');
    addTeams.getSkillID();
    addTeams.submitAddTeamButton();
  });

  it('Verify Super Admin should able to Add New Member role', () => {
    const addTeams = new AddTeam();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    addTeams.visitTeamPage().click();
    addTeams.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    addTeams.getUserTypeMember();
    addTeams.getPassword().type('Password@123');
    addTeams.getConfirmPassword().type('Password@123');
    addTeams.getSkillID();
    addTeams.submitAddTeamButton();
  });
});
