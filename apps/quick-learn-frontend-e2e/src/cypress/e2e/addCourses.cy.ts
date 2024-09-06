import addCourses= require("../test/addCourses");
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
  it('Verify User should able to add Courses', () => {
    const addCourse = new addCourses()
    addCourse.OpenAccountSettings()
    addCourse.openCourses()
    addCourse.clickCourses()
    addCourse.addCourses()
    addCourse.saveButton()

  });
  it('Verify User should not able to add empty courses', () => {
    const addCourse = new addCourses()
    addCourse.OpenAccountSettings()
    addCourse.openCourses()
    addCourse.clickCourses()
    addCourse.addCoursesWithOnlySpaces()
    addCourse.getErrorMessage().should('contain','This field is mandatory and cannot contain only whitespace')

  });
  it('Verify User should not able to add empty courses', () => {
    const addCourse = new addCourses()
    addCourse.OpenAccountSettings()
    addCourse.openCourses()
    addCourse.clickCourses()
    addCourse.addCoursesWithMoreLimit()
    addCourse.getErrorMessage().should('contain','The value should not exceed 30 character')

  });

  


})
