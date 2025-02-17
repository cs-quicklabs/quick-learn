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

  it('Verify user able to create Roadmap', () => {
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
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
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
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
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
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
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    const PendingApproval = new Approvals();
    PendingApproval.EditApprovalPendingLesson();
  });

  it('Verify All Columns Name under Approval list at Admin end', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const ApproveLesson = new Approvals();
    ApproveLesson.getApprovalColumnData();
  });

  it('Verify Admin able to approve the lessons', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const ApproveLesson = new Approvals();
    ApproveLesson.ApproveLessonViaSuperAdmin();
  });

  it('Verify that the breadcrumbs are not clickable under Approved lesson', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const ApproveLesson = new Approvals();
    ApproveLesson.BreadCrumbsUnclickable();
  });
});
