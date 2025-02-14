import { AddRoadMap } from '../test/AddRoadMapCategories';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

describe('Roadmap create, edit and delete', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });
  it('Verify Super Admin should able to add Roadmap categories', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadMapCategories();
    AddRoadMaps.saveButton();
    AddRoadMaps.getSuccessMessage().should(
      'contain',
      'Successfully created roadmap category.',
    );
  });

  it('Verify Super Admin should not able to add empty roadmap category', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadMapCategoriesWithOnlySpaces();
    AddRoadMaps.getErrorMessage().should('contain', 'This field is mandatory');
  });

  it('Verify Super Admin should not able to add roadmap category with special characters', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.AddRoadmapCategoryWithSpecialChar();
  });

  it('Verify Add Roadmap category field should not accept more than 30 characters', () => {
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
    AddRoadMaps.getSuccessMessage().should(
      'contain',
      'Roadmap category is updated.',
    );
  });

  it('Verify Super admin should not able to edit Roadmap categories with empty spaces', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.editRoadmapCategoriesWithEmptySpaces();
  });

  it('Verify Super admin should not able to edit Roadmap categories with special characters', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.EditRoadmapCategoryWithSpecialChar();
  });

  it('Verify Edit Roadmap category field should not accept more than 30 characters', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.clickRoadmapField();
    AddRoadMaps.EditRoadMapCategoriesWithMoreLimit();
  });

  it('Verify Super admin should able to Delete Roadmap', () => {
    const AddRoadMaps = new AddRoadMap();
    AddRoadMaps.OpenAccountSettings();
    AddRoadMaps.openRoadMap();
    AddRoadMaps.getDeleteRoadmapButton();
    // AddRoadMaps.getSuccessMessage().should('contain', 'Roadmap is deleted.');
  });

  // it('Verify Super admin should not able to Delete Roadmap category associated with other Roadmaps', () => {
  //   const AddRoadMaps = new AddRoadMap();
  //   AddRoadMaps.OpenAccountSettings();
  //   AddRoadMaps.openRoadMap();
  //   AddRoadMaps.deleteRoadMapCategories();
  // });
});
