import { AddCourseCategory } from '../test/AddCourseCategory';
import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';

describe('Course create, edit and delete', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });
  it('Verify Super Admin should able to add Courses', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.AddCourseCategory();
    addCourse.saveButton();
    addCourse
      .getSuccessMessage()
      .should('contain', 'Successfully added course category');
  });
  it('Verify Super Admin should not able to add empty courses', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.AddCourseCategoryWithOnlySpaces();
    addCourse.getErrorMessage().should('contain', 'This field is mandatory');
  });

  it('Verify Super Admin should  not able to add Course category with special characters', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.AddCourseCategoryWithSpecialChar();
  });
  it('Verify Add Course category field should not accept more than 30 characters', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.AddCourseCategoryWithMoreLimit();
    addCourse
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 characters.');
  });

  it('Verify Super admin able to edit Course Categories', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.editCourseCategories();
    addCourse
      .getSuccessMessage()
      .should('contain', 'Course category is updated.');
  });

  it('Verify Super admin should not able to edit Course categories with empty spaces', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.editCourseCategoriesWithEmptySpaces();
  });

  it('Verify Super Admin should  not able to Edit Course category with special characters', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.editCourseCategoryWithSpecialChars();
  });

  it('Verify Edit Course category field should not accept more than 30 characters', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.clickCourseCategory();
    addCourse.EditCourseCategoryWithMoreLimit();
  });

  it('Verify Super admin should able to Delete Course categories', () => {
    const addCourse = new AddCourseCategory();
    addCourse.OpenAccountSettings();
    addCourse.openCourseCategory();
    addCourse.getDeleteCourseButton();
    // addCourse
    //   .getSuccessMessage()
    //   .should('contain', 'Course category is deleted.');
  });

  // it('Verify Super admin should not able to Delete Course category associated with other courses', () => {
  //   const addCourse = new AddCourseCategory();
  //   addCourse.OpenAccountSettings();
  //   addCourse.openCourseCategory();
  //   addCourse.deleteCourseCategoryAssociatedWithCourses();
  // });
});
