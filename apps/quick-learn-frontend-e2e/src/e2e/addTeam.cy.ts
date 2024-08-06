import AddTeam = require("../test/addTeam");
import LoginPage = require("../test/Login");

describe('Login Test', () => {
    const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains("Sign in to your account")
    loginPage.login('super.admin@yopmail.com', 'Password@123');

    cy.url().should('include', '/dashboard'); 
    loginPage.getWelcomeMessage().should('contain', 'Login Success!');
  });

  it('able to Add Team', () => {
    const addTeams = new AddTeam();
    addTeams.addTeam()
    
  });
})

