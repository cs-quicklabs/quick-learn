import { LoginPage } from '../test/Login';
import {
  Admin1ValidCredentials,
  EditorValidCredentials,
  MemberValidCredentials,
  validCredentials,
} from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(function () {
    loginPage.visit();
  });

  it('should display the login page', () => {
    cy.get('.text-xl').contains('Sign in to your account');
  });

  it('should display an error for invalid credentials', () => {
    loginPage.loginWithInvalidCredential(
      validCredentials.mail,
      'InvalidPassword',
    );
    loginPage.getErrorMessage().should('contain', 'Wrong Credentials!');
  });

  it('Should display an error for incorrect data passed', () => {
    loginPage.loginWithIncorrectData();
  });

  it('should log in with valid credentials of Super Admin', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
  });
  it('should not allow login with empty email and password fields', () => {
    loginPage.loginWithEmptyValue();
  });

  it('should log in with Editor valid credentials', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );

    cy.url().should('include', '/dashboard');
  });

  it('should log in with Admin valid credentials', () => {
    loginPage.loginAsAdmin(
      Admin1ValidCredentials.Admin1Mail,
      Admin1ValidCredentials.Admin1Password,
    );

    cy.url().should('include', '/dashboard');
  });

  it('should log in with Member valid credentials', () => {
    loginPage.loginAsMember(
      MemberValidCredentials.MemberMail,
      MemberValidCredentials.MemberPassword,
    );

    cy.url().should('include', '/dashboard');
  });
});
