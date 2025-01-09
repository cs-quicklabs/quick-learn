import { UpdateGeneralSettings } from '../test/UpdateGeneralSettings';
import { LoginPage } from '../test/Login';
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

  it('Verify user able to upload logo', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.uploadLogo();
  });

  it('Verify User should able to Navigate to Account settings Page', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.getAccountSettings();
  });

  it('Verify user able to Update Name in general Settings Section ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.editSettings();
  });

  it('Verify Team Name field should not accept only spaces ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.editTeamNameWithOnlySpaces();
  });
});
