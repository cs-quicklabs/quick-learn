import { AddPrimarySkill } from '../test/AddPrimarySkill';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

describe('Primary Skill Update', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });
  it('Verify User should able to add Skill', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.AddPrimarySkill();
    addSkill.saveButton();
  });

  it('Verify User should  not able to add Skill with only spaces', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.AddPrimarySkillWithOnlySpaces();
    addSkill.getErrorMessage().should('contain', 'This field is mandatory');
  });

  it('Verify Primary skill field should not accept more than 30 Characters', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.clickSkillField();
    addSkill.AddPrimarySkillWithMoreCharacters();
    addSkill
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 characters.');
  });

  it('Verify Super admin able to edit Skill', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.editPrimarySkill();
  });

  it('Verify Super admin should not able to edit Skill with empty spaces', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.editPrimarySkillWithEmptySpaces();
  });

  it('Verify Super admin should able to Delete Skill', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.deletePrimarySkill();
  });

  it('Verify Super admin should not able to Delete Skill associated to team members', () => {
    const addSkill = new AddPrimarySkill();
    addSkill.OpenAccountSettings();
    addSkill.openPrimarySkill();
    addSkill.deleteSkillCategories();
  });
});
