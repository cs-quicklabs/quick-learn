import LoginPage = require('../test/Login');
import TeamsPage = require('../test/Teams');
import { validCredentials } from '../fixtures/credential';

describe('Login Test', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });

  it('Verify All Columns Name', () => {
    const Teams = new TeamsPage();
    Teams.getTeamsColumnData();
  });
  it('Verify User able to filter admin list', () => {
    const Teams = new TeamsPage();
    Teams.filterAdminList();
  });
  it('Verify User able to filter Editor list', () => {
    const Teams = new TeamsPage();
    Teams.filterEditorList();
  });
  it('Verify User able to filter Member list', () => {
    const Teams = new TeamsPage();
    Teams.filterMemberList();
  });
  it('Verify Super admin able to Search Users', () => {
    const Teams = new TeamsPage();
    Teams.visitTeamPage().click();
    Teams.searchUser();
  });
});
