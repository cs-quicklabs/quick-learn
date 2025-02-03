import { LoginPage } from '../test/Login';
import { Approvals } from '../test/Approvals';
import {
  EditorValidCredentials,
  validCredentials,
} from '../fixtures/credential';
describe('Lesson Approval', () => {
  const loginPage = new LoginPage();
  beforeEach(function () {
    loginPage.visit();
  });

  it('Verify Editor able to send a lesson for approval', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const SendApproval = new Approvals();
    SendApproval.SendForApprovalViaEditor();
  });

  it('Verify Admin able to approve the lessons', () => {
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
    const ApproveLesson = new Approvals();
    ApproveLesson.ApproveLessonViaSuperAdmin();
  });
});
