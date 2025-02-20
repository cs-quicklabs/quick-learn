import { UpdateGeneralSettings } from '../test/UpdateGeneralSettings';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify User should able to Navigate to Account settings Page', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.getAccountSettings();
  });

  it('Verify user able to upload logo', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.uploadLogo();
    updateSetting.getSuccessMessage();
  });

  it('Verify user able to Update Name in general Settings Section ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.editSettings();
  });

  it('Verify Team Name field should not accept only spaces ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.editTeamNameWithOnlySpaces();
  });

  it('Verify Team Name field should not accept invalid data ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.editTeamNameWithIncorrectData();
  });

  it('Verify User should not able to Upload Profile Pic more than 1 MB ', () => {
    const updateSetting = new UpdateGeneralSettings();
    updateSetting.uploadPicWithMoreMB();
    updateSetting.getSuccessMessage();
  });
});
