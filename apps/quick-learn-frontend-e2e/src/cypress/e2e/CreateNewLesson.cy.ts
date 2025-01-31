import { LoginPage } from '../test/Login';
import { CreateNewLesson } from '../test/CreateNewLesson';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('New Lesson Creation', () => {
  const loginPage = new LoginPage();
  const generateRandomLesson = () => ({
    title: faker.lorem.sentence(8),
    content: faker.lorem.paragraphs(1),
  });
  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });

  it('Verify user able to create New Lesson', () => {
    const NewLesson = new CreateNewLesson();
    NewLesson.NewLessonCreation();
    const lesson = generateRandomLesson();
    const longText = faker.lorem.paragraphs(1);
    cy.get('textarea.w-full').type(lesson.title);
    // cy.get('div.ql-editor').type(lesson.content);
    cy.get('div.ql-editor').type('{selectall}{backspace}'); // Clear existing content if any
    cy.get('div.ql-editor').type(longText, {
      parseSpecialCharSequences: false,
    });
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast-body')
      .contains('Successfully created a lesson.')
      .should('be.visible');
  });

  it('Verify user not able to create an empty lesson', () => {
    const NewLesson = new CreateNewLesson();
    NewLesson.LessonCreationWithWhiteSpaces();
  });

  it('Verify user not able to create lesson with exceeded limit', () => {
    const NewLesson = new CreateNewLesson();
    NewLesson.CreateLessonWithLimitExceed();
  });

  it('Verify user able to Edit Lesson', () => {
    const NewLesson = new CreateNewLesson();
    NewLesson.EditLesson();
    const lesson = generateRandomLesson();
    cy.get('textarea.w-full').clear();
    cy.get('textarea.w-full').type(lesson.title);
    cy.get('div.ql-editor').clear();
    cy.get('div.ql-editor').type(lesson.content);
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast-body')
      .contains('Successfully updated a lesson.')
      .should('be.visible');
  });

  it('Verify user able to Archive the Lesson', () => {
    const NewLesson = new CreateNewLesson();
    NewLesson.ArchiveLesson();
  });
});
