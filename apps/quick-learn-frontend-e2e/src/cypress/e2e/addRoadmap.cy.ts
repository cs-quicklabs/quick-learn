import { AddRoadMap } from '../test/AddRoadMapCategories';
import { LoginPage } from '../test/Login';
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
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadMapCategories();
    AddRoadMaps.saveButton();
  });

  it('Verify User should not able to add empty roadmap', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadMapCategoriesWithOnlySpaces();
    AddRoadMaps.getErrorMessage().should('contain', 'This field is mandatory');
  });
  it('Verify Roadmap field should not expect more than 30 characters', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadMapCategoriesWithMoreLimit();
    AddRoadMaps.getErrorMessage().should(
      'contain',
      'The value should not exceed 30 characters.',
    );
  });
  it('Verify Super admin able to edit Roadmap Categories', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.editRoadmapCategories();
  });

  it('Verify Super admin should not able to edit Roadmap categories with empty spaces', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.editRoadmapCategoriesWithEmptySpaces();
  });

  it('Verify Super admin should able to Delete Roadmap', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.deleteRoadMap();
  });

  // it('Verify Super admin should not able to Delete Roadmap category associated with other Roadmaps', () => {
  //   const AddRoadMaps = new AddRoadMap();
  //   AddRoadMaps.OpenAccountSettings();
  //   AddRoadMaps.openRoadMap();
  //   AddRoadMaps.deleteRoadMapCategories();
  // });
});
