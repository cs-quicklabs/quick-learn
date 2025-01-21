import { LoginPage } from '../test/Login';
import { Approvals } from '../test/Approvals';
import { EditorValidCredentials } from '../fixtures/credential';
import { validCredentials } from '../fixtures/credential';

describe('Lesson Approval', () => {
  const loginPage1 = new LoginPage();
  const loginPage2 = new LoginPage();

  it('Verify Editor able to send a lesson for approval', () => {
    loginPage1.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage1.login(
      EditorValidCredentials.mail,
      EditorValidCredentials.password,
    );

    cy.url().should('include', '/dashboard');
    loginPage1.getWelcomeMessage().should('contain', 'Successfully logged in.');
    const SendApproval = new Approvals();
    SendApproval.SendForApprovalViaEditor();
  });

  it('Verify Editor not able to edit pending for approval lessons', () => {
    loginPage1.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage1.login(
      EditorValidCredentials.mail,
      EditorValidCredentials.password,
    );
    cy.url().should('include', '/dashboard');
    loginPage1.getWelcomeMessage().should('contain', 'Successfully logged in.');

    const PendingApproval = new Approvals();
    PendingApproval.DoNotApprovePendingApprovalLessons();
  });

  it('Verify Admin able to approve the lessons', () => {
    loginPage2.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage2.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage2.getWelcomeMessage().should('contain', 'Successfully logged in.');
    const ApproveLesson = new Approvals();
    ApproveLesson.ApproveLessonViaSuperAdmin();
  });
});
