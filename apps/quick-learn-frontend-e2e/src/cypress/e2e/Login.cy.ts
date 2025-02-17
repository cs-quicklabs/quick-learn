import { LoginPage } from '../test/Login';
import {
  Admin1ValidCredentials,
  EditorValidCredentials,
  MemberValidCredentials,
  validCredentials,
} from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  it('should display the login page', () => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
  });

  it('should display an error for invalid credentials', () => {
    loginPage.visit();
    loginPage.loginWithInvalidCredential(
      validCredentials.mail,
      'InvalidPassword',
    );
    loginPage.getErrorMessage().should('contain', 'Wrong Credentials!');
  });

  it('Should display an error for incorrect data passed', () => {
    loginPage.visit();
    loginPage.loginWithIncorrectData();
  });

  it('should log in with valid credentials of Super Admin', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('should not allow login with empty email and password fields', () => {
    loginPage.visit();
    loginPage.loginWithEmptyValue();
  });

  it('should log in with Editor valid credentials', () => {
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
  });

  it('should log in with Admin valid credentials', () => {
    loginPage.initialize(
      Admin1ValidCredentials.Admin1Mail,
      Admin1ValidCredentials.Admin1Password,
    );
  });

  it('should log in with Member valid credentials', () => {
    loginPage.initialize(
      MemberValidCredentials.MemberMail,
      MemberValidCredentials.MemberPassword,
    );
  });
});
