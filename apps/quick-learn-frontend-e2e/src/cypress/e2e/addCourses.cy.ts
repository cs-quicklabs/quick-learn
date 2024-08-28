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
  it('Verify User should able to add Skill', () => {
    const addCourse = new addCourses()
    addCourse.OpenAccountSettings()
    addCourse.openCourses()
    addCourse.clickCourses()
    addCourse.addCourses()
    addCourse.saveButton()

  });


})
