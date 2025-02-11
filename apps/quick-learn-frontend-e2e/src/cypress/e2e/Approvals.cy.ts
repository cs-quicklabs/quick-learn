import { LoginPage } from '../test/Login';
import { Approvals } from '../test/Approvals';
import {
  EditorValidCredentials,
  validCredentials,
} from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('Lesson Approval', () => {
  const loginPage = new LoginPage();
  const generateRandomRoadmapTitle = () => ({
    title: faker.lorem.sentence(10),
  });
  const generateRandomCourseTitle = () => ({
    title: faker.lorem.sentence(10),
  });
  const generateRandomLesson = () => ({
    title: faker.lorem.sentence(8),
    content: faker.lorem.paragraphs(1),
  });
  beforeEach(function () {
    loginPage.visit();
  });

  it('Verify user able to create Roadmap', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const NewEditorRoadmap = new Approvals();
    NewEditorRoadmap.RoadmapCreationViaEditor();
    const roadmap = generateRandomRoadmapTitle();
    cy.get('#addRoadmapForm_textarea_description').type(roadmap.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Roadmap created Successfully.')
      .should('be.visible');
  });

  it('Verify user able to create New Course', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const NewEditCourse = new Approvals();
    NewEditCourse.CourseCreationViaEditor();
    const course = generateRandomCourseTitle();
    cy.get('#addCourseForm_textarea_description').type(course.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Course created successfully.')
      .should('be.visible');
  });

  it('Verify Editor able to Create a lesson and send for approval', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const SendApproval = new Approvals();
    SendApproval.SaveAndSendForApproval();
    const lesson = generateRandomLesson();
    const longText = faker.lorem.paragraphs(1);
    cy.get('textarea.w-full').type(lesson.title);
    cy.get('div.ql-editor').type('{selectall}{backspace}'); // Clear existing content if any
    cy.get('div.ql-editor').type(longText, {
      parseSpecialCharSequences: false,
    });
    cy.get('button[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Successfully created a lesson.')
      .should('be.visible');
  });

  it('Verify Editor able to edit pending for approval lessons', () => {
    loginPage.loginAsEditor(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    cy.url().should('include', '/dashboard');
    const PendingApproval = new Approvals();
    PendingApproval.EditApprovalPendingLesson();
  });

  it('Verify All Columns Name under Approval list at Admin end', () => {
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
    const ApproveLesson = new Approvals();
    ApproveLesson.getApprovalColumnData();
  });

  it('Verify Admin able to approve the lessons', () => {
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
    const ApproveLesson = new Approvals();
    ApproveLesson.ApproveLessonViaSuperAdmin();
  });

  it('Verify that the breadcrumbs are not clickable under Approved lesson', () => {
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
    const ApproveLesson = new Approvals();
    ApproveLesson.BreadCrumbsUnclickable();
  });
});
