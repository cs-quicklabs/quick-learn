import LoginPage = require("../test/Login");

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should display the login page', () => {

    cy.get('.text-xl').contains("Sign in to your account")
  });

  it('should display an error for invalid credentials', () => {

    loginPage.loginWithInvalidCredential("super.admin@yopmail.com","Password@123");

    loginPage.getErrorMessage().should('contain', 'Wrong Credentials!');
  });

  it('should log in with valid credentials', () => {

    loginPage.login();

    cy.url().should('include', '/dashboard'); 
    loginPage.getWelcomeMessage().should('contain', 'Login Success!'); // Adjust selector and text as needed
  });
  
});
