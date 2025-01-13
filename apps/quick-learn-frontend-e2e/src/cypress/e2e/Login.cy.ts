import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

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

  it('should log in with valid credentials', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });
  it('should not allow login with empty email and password fields', () => {
    loginPage.loginWithEmptyValue();
  });
});
