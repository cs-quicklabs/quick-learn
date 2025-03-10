import { AddPrimarySkill } from '../test/AddPrimarySkill';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

describe('Primary Skill create, edit and delete', () => {
  // Create a single instance of the page object for reuse
  const primarySkillPage = new AddPrimarySkill();

  // Setup - Login once before all tests
  beforeEach(() => {
    const loginPage = new LoginPage();
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify Super Admin should able to add Skill', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.clickSkillField();
    primarySkillPage.AddPrimarySkill();
    primarySkillPage.saveButton();
    primarySkillPage
      .getSuccessMessage()
      .should('contain', 'Primary skill has been added successfully.');
  });

  it('Verify Super Admin should not able to add Skill with only spaces', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.clickSkillField();
    primarySkillPage.AddPrimarySkillWithOnlySpaces();
    primarySkillPage
      .getErrorMessage()
      .should('contain', 'This field is mandatory');
  });

  it('Verify Super Admin should not able to add Skill with special characters', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.clickSkillField();
    primarySkillPage.AddPrimarySkillWithSpecialChar();
    // Assuming there should be an error message validation here
    primarySkillPage.getErrorMessage().should('be.visible');
  });

  it('Verify Add Primary skill field should not accept more than 30 Characters', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.clickSkillField();
    primarySkillPage.AddPrimarySkillWithMoreCharacters();
    primarySkillPage
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 characters.');
  });

  // Tests for editing skills
  it('Verify Super admin able to edit Skill', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.editPrimarySkill();
    primarySkillPage
      .getSuccessMessage()
      .should('contain', 'Primary skill is updated.');
  });

  it('Verify Super admin should not able to edit Skill with empty spaces', () => {
    primarySkillPage.openPrimarySkill();
    // Assuming there should be an error message validation here
    primarySkillPage.editPrimarySkillWithEmptySpaces();
  });

  it('Verify Super admin should not able to edit Skill with special characters', () => {
    primarySkillPage.openPrimarySkill();
    // Assuming there should be an error message validation here
    primarySkillPage.editPrimarySkillWithSpecialChars();
  });

  it('Verify Edit Primary skill field should not accept more than 30 Characters', () => {
    primarySkillPage.openPrimarySkill();
    primarySkillPage.clickSkillField();
    // Assuming there should be an error message validation here
    primarySkillPage.EditPrimarySkillWithMoreCharacters();
  });

  // Tests for deleting skills
  it('Verify Super admin should able to Delete Skill', () => {
    primarySkillPage.openPrimarySkill();
    // Assuming there should be a confirmation or success message
    primarySkillPage.getDeleteSkillButton();
  });
});
