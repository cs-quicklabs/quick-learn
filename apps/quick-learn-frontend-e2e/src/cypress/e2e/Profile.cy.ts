import LoginPage = require('../test/Login');
import profile = require('../test/Profile');
import { validCredentials } from '../fixtures/credential';

describe('Primary Skill Update', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });
  it('Verify User should able to Upload profile Pic ', () => {
    const myProfiles = new profile();
    myProfiles.OpenProfile();
    myProfiles.getMyProfile();
    myProfiles.uploadPic();
  });
  it('Verify User should able to Update First name ', () => {
    const myProfiles = new profile();
    myProfiles.OpenProfile();
    myProfiles.getMyProfile();
    myProfiles.UpdateFirstName();
  });
  it('Verify User should not able to Update First name with empty spaces  ', () => {
    const myProfiles = new profile();
    myProfiles.OpenProfile();
    myProfiles.getMyProfile();
    myProfiles.UpdateFirstNameWithEmptySpaces();
  });
  it('Verify User should able to Update Last name', () => {
    const myProfiles = new profile();
    myProfiles.OpenProfile();
    myProfiles.getMyProfile();
    myProfiles.UpdateLastName();
  });
});
