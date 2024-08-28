import addPrimarySkill= require("../test/addPrimarySkill");
import LoginPage = require("../test/Login");

describe('Primary Skill Update', () => {
    const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains("Sign in to your account")
    loginPage.login();

    cy.url().should('include', '/dashboard'); 
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });
  it('Verify User should able to add Skill', () => {
    const addSkill = new addPrimarySkill()
    addSkill.OpenAccountSettings()
    addSkill.openPrimarySkill()
    addSkill.clickSkillField()
    addSkill.addPrimarySkill()
    addSkill.saveButton()

  });


})
