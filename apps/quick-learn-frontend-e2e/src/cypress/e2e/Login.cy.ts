import LoginPage = require('../test/Login');
import { validCredentials } from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should display the login page', () => {
    cy.get('.text-xl').contains('Sign in to your account');
  });

  it('should display an error for invalid credentials', () => {
    loginPage.loginWithInvalidCredential(
      'super.admin@yopmail.com',
      'Password@123',
    );

    loginPage.getErrorMessage().should('contain', 'Wrong Credentials!');
  });

  it('should log in with valid credentials', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.'); // Adjust selector and text as needed
  });
  it('Verify user not able to login with empty value in email and password', () => {
    loginPage.loginWithEmptyValue();
  });
});
