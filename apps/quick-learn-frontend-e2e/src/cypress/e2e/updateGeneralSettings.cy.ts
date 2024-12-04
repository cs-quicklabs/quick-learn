import updateSettings = require('../test/updateGeneralSettings');
import LoginPage = require('../test/Login');
import { validCredentials } from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });

  it('Verify User should able to Navigate to Account settings Page', () => {
    const updateSetting = new updateSettings();
    updateSetting.OpenAccountSettings();
  });

  it('Verify user able to Update Name in general Settings Section ', () => {
    const updateSetting = new updateSettings();
    updateSetting.editSettings();
  });

  it('Verify Team Name field should not accept only spaces ', () => {
    const updateSetting = new updateSettings();
    updateSetting.editTeamNameWithOnlySpaces();
  });
});
