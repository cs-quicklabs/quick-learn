import { LoginPage } from '../test/Login';
import { MyLearningPaths } from '../test/MyLearningPaths';
import { MemberValidCredentials } from '../fixtures/credential';

describe('My Learning Paths', () => {
  const loginPage = new LoginPage();
  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(
      MemberValidCredentials.MemberMail,
      MemberValidCredentials.MemberPassword,
    );
    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });

  it('Verify user should able to navigate to lesson page via RoadMap', () => {
    const LearningPaths = new MyLearningPaths();
    LearningPaths.NavigateViaRoadMap();
  });

  it('Verify user should able to navigate to lesson page via Courses', () => {
    const LearningPaths = new MyLearningPaths();
    LearningPaths.NavigateViaCourses();
  });

  it('Verify User should able to Mark a lesson as Read/Unread', () => {
    const LearningPaths = new MyLearningPaths();
    LearningPaths.NavigateViaCourses();
  });
});
