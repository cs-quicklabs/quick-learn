import addRoadmap = require('../test/addRoadMapCategories');
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
  it('Verify User should able to add Roadmap categories', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.clickRoadmapField();
    addRoadmaps.addRoadMapCategories();
    addRoadmaps.saveButton();
  });

  it('Verify User should not able to add empty courses', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.clickRoadmapField();
    addRoadmaps.addRoadmapCategoriesWithOnlySpaces();
    addRoadmaps.getErrorMessage().should('contain', 'This field is mandatory');
  });
  it('Verify Course field should not expect more than 30 characters', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.clickRoadmapField();
    addRoadmaps.addRoadmapCategoriesWithMoreLimit();
    addRoadmaps
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 character');
  });
  it('Verify Super admin able to edit Roadmap Categories', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.editRoadmapCategories();
  });

  it('Verify Super admin should not able to edit Roadmap categories with empty spaces', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.editRoadmapCategoriesWithEmptySpaces();
  });

  it('Verify Super admin should able to Delete Roadmap', () => {
    const addRoadmaps = new addRoadmap();
    addRoadmaps.OpenAccountSettings();
    addRoadmaps.openRoadMap();
    addRoadmaps.deleteRoadMap();
  });
});
