import { LoginPage } from '../test/Login';
import { CreateNewCourse } from '../test/CreateCourse';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('New Course Creation', () => {
  const loginPage = new LoginPage();
  const generateRandomLesson = () => ({
    title: faker.lorem.sentence(10),
  });
  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
  });

  it('Verify user able to create New Course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.NewCourseCreation();
    const lesson = generateRandomLesson();
    cy.get('#addCourseForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').click();
    cy.get('.Toastify__toast-body')
      .contains('Course created successfully.')
      .should('be.visible');
  });

  it('Verify user not able to create an empty course', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.CourseCreationWithWhiteSpaces();
  });

  it('Verify user not able to create course with exceeded limit', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.CreateCourseWithLimitExceed();
    const longText = faker.lorem.paragraphs(200);
    cy.get('#addCourseForm_textarea_description').invoke('val', longText);
    cy.get('#addCourseForm_textarea_description').type(
      'A short initial input ',
    );
    cy.get('.mt-1')
      .eq(1)
      .contains('The value should not exceed 5000 characters.');
    cy.get('button[type="button"]').contains('Cancel').click();
  });

  it('Verify user able to Edit roadmap', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.EditCourse();
    const lesson = generateRandomLesson();
    cy.get('#addCourseForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').click();
    cy.get('.Toastify__toast-body')
      .contains('Course updated successfully.')
      .should('be.visible');
  });

  it('Verify User able to Assign Existing Courses to Roadmap', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.AssignExistingRoadmapsToCourses();
  });

  it('Verify user able to unassign existing courses from roadmap', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.UnassignExistingRoadmapsToCourses();
  });

  it('Verify user able to Delete the Roadmap', () => {
    const NewRoadmap = new CreateNewCourse();
    NewRoadmap.DeleteCourse();
  });
});
