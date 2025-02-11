import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { ArchiveLessons } from '../test/ArchiveLessons';

describe('Activate and Delete Lessons', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });
  it('Verify Super admin should able to search Lesson', () => {
    const ArchiveLesson = new ArchiveLessons();
    ArchiveLesson.SearchLesson();
  });

  it('Verify Super admin should able to Activate Lesson', () => {
    const ArchiveLesson = new ArchiveLessons();
    ArchiveLesson.ActivateLesson();
  });
  it('Verify Super Admin should able to Delete Lesson', () => {
    const ArchiveLesson = new ArchiveLessons();
    ArchiveLesson.DeleteLesson();
  });
});
