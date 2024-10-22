import addPrimarySkill = require('../test/addPrimarySkill');
import LoginPage = require('../test/Login');
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
  it('Verify User should able to add Skill', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.addPrimarySkill();
    addSkill.saveButton();
  });

  it('Verify User should  not able to add Skill with only spaces', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.addPrimarySkillWithOnlySpaces();
    addSkill.getErrorMessage().should('contain', 'This field is mandatory');
  });

  it('Verify Primary skill field should not accept more than 30 Characters', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.addPrimarySkillWithMoreCharacters();
    addSkill
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 character');
  });

  it('Verify Super admin able to edit Skill', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.editPrimarySkill();
  });

  it('Verify Super admin should not able to edit Skill with empty spaces', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.editPrimarySkillWithEmptySpaces();
  });

  it('Verify Super admin should able to Delete Skill', () => {
    const addSkill = new addPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.deletePrimarySkill();
  });
});
