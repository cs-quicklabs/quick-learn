import addRoadmap= require("../test/addRoadMapCategories");
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
  it('Verify User should able to add Roadmap categories', () => {
    const addRoadmaps = new addRoadmap()
    addRoadmaps.OpenAccountSettings()
    addRoadmaps.openRoadMap()
    addRoadmaps.clickRoadmapField()
    addRoadmaps.addRoadMapCategories()
    addRoadmaps.saveButton()

  });

  it('Verify User should not able to add empty courses', () => {
    const addRoadmaps = new addRoadmap()
    addRoadmaps.OpenAccountSettings()
    addRoadmaps.openRoadMap()
    addRoadmaps.clickRoadmapField()
    addRoadmaps.addRoadmapCategoriesWithOnlySpaces()
    addRoadmaps.getErrorMessage().should('contain','This field is mandatory and cannot contain only whitespace')

  });
  it('Verify Course field should not expect more than 30 characters', () => {
    const addRoadmaps = new addRoadmap()
    addRoadmaps.OpenAccountSettings()
    addRoadmaps.OpenAccountSettings()
    addRoadmaps.openRoadMap()
    addRoadmaps.clickRoadmapField()
    addRoadmaps.addRoadmapCategoriesWithMoreLimit()
    addRoadmaps.getErrorMessage().should('contain','The value should not exceed 30 character')

  });



  })
