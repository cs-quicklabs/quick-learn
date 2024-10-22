import addCourses = require('../test/addCourses');
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
  it('Verify User should able to add Courses', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.clickCourses();
    addCourse.addCourses();
    addCourse.saveButton();
  });
  it('Verify User should not able to add empty courses', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.clickCourses();
    addCourse.addCoursesWithOnlySpaces();
    addCourse.getErrorMessage().should('contain', 'This field is mandatory');
  });
  it('Verify Course field should not expect more than 30 characters', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.clickCourses();
    addCourse.addCoursesWithMoreLimit();
    addCourse
      .getErrorMessage()
      .should('contain', 'The value should not exceed 30 character');
  });

  it('Verify Super admin able to edit Courses Categories', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.editCourseCategories();
  });

  it('Verify Super admin should not able to edit Course categories with empty spaces', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.editCourseCategoriesWithEmptySpaces();
  });

  it('Verify Super admin should able to Delete Course categories', () => {
    const addCourse = new addCourses();
    addCourse.OpenAccountSettings();
    addCourse.openCourses();
    addCourse.deleteCourseCategories();
  });
});
