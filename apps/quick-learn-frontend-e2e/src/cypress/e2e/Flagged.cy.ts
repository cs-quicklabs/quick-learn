import { LoginPage } from '../test/Login';
import { Flagged } from '../test/Flagged';
import {
  EditorValidCredentials,
  validCredentials,
} from '../fixtures/credential';

describe('Flagged Lesson', () => {
  const loginPage = new LoginPage();

  beforeEach(function () {
    loginPage.visit();
  });

  it('Verify that only Admin or Super Admin is able to Unflag the lesson of the day', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.UnflagLessonViaSuperAdmin();
  });

  it('Verify that breadcrumbs are not clickable under flagged lesson', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.BreadCrumbsUnclickable();
  });

  it('Verify that the Search functionality is working as expected', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.SearchFlaggedLesson();
  });

  it('Verify that flagged lessons are displayed under flag module', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.getFlaggedLessonList();
  });

  it('Verify that Flagged list is displayed and Unflag lesson option is not present at Editor end', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const EditorFlag = new Flagged();
    EditorFlag.CannotUnflagViaEditor();
  });

  it('Verify All Columns Name under Flagged lesson list', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.getFlaggedLessonColumnData();
  });

  it('Verify that the Flag badge count matches the Flagged List count ', () => {
    loginPage.login(validCredentials.mail, validCredentials.password);
    cy.url().should('include', '/dashboard');
    const AdminFlag = new Flagged();
    AdminFlag.MatchFlagAndListCount();
  });
});
