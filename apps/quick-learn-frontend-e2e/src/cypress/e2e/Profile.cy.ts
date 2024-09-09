import LoginPage = require("../test/Login");
import profile = require("../test/Profile");

describe('Primary Skill Update', () => {
    const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains("Sign in to your account")
    loginPage.login();

    cy.url().should('include', '/dashboard'); 
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });
  it('Verify User should able to Upload profile Pic ', () => {
    const myProfiles = new profile()
    myProfiles.OpenProfile()
    myProfiles.getMyProfile()
    myProfiles.uploadPic()

  });
})