import { LoginPage } from '../test/Login';
import { EditTeamMember } from '../test/EditTeamMember';
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

  it('Verify All Columns Name', () => {
    const EditUser = new EditTeamMember();
    EditUser.getTeamsColumnData();
  });

  it('Verify Error Validation', () => {
    const EditUser = new EditTeamMember();
    EditUser.ErrorValidation();
  });

  it('Admin able to Add Team', () => {
    const EditUser = new EditTeamMember();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    EditUser.visitTeamPage().click();
    EditUser.getAddTeamButton().click();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').type(fakeEmail);
    EditUser.getUserTypeAdmin();
    EditUser.getPassword().type('Password@123');
    EditUser.getConfirmPassword().type('Password@123');
    EditUser.getSkillID();
    EditUser.submitAddTeamButton();
  });

  it('Verify Super admin able to edit users ', () => {
    const EditUser = new EditTeamMember();
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const fakeEmail = faker.internet.email();
    EditUser.visitTeamPage().click();
    EditUser.getTeamsList();
    EditUser.getEditUserButton();
    cy.get('#first_name').clear();
    cy.get('#first_name').type(randomFirstName);
    cy.get('#last_name').clear();
    cy.get('#last_name').type(randomLastName);
    cy.get('#email').clear();
    cy.get('#email').type(fakeEmail);
    EditUser.getUserTypeEditor();
    EditUser.getSkillID();
    EditUser.getSubmitButton();
  });

  it('Verify Super Admin is able to mark user as Inactive', () => {
    const EditUser = new EditTeamMember();
    EditUser.MarkUserInactive();
  });

  it('Verify Super Admin able to deactivate a user', () => {
    const EditUser = new EditTeamMember();
    EditUser.DeactivateUser();
  });
});
