import { LoginPage } from '../test/Login';
import { Profile } from '../test/Profile';
import { validCredentials } from '../fixtures/credential';

describe('Primary Skill Update', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify User should able to Upload Profile Pic ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.uploadPic();
  });

  it('Verify User should able to Update First name ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.UpdateFirstName();
  });

  it('Verify User should able to Update Last name', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.UpdateLastName();
  });

  it('Verify User should not able to Update First name with empty spaces  ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.UpdateFirstNameWithEmptySpaces();
  });

  it('Verify User should not able to Update Last name with empty spaces  ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.UpdateLastNameWithEmptySpaces();
  });

  it('Verify error message is displayed when incorrect data is entered in the First and Last names ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.UpdateNameFieldWithIncorrectData();
  });

  it('Verify user not able to edit the email', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.EmailFieldDisabled();
  });

  it('Verify User should not able to Upload Profile Pic more than 1 MB ', () => {
    const myProfiles = new Profile();
    myProfiles.getMyProfile();
    myProfiles.uploadPicWithMoreMB();
    myProfiles.uploadPic();
  });
});
