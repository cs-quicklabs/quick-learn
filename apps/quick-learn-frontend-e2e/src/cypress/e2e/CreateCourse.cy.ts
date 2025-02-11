import { LoginPage } from '../test/Login';
import { CreateNewCourse } from '../test/CreateCourse';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('New Course Creation', () => {
  const loginPage = new LoginPage();
  const generateRandomCourseTitle = () => ({
    title: faker.lorem.sentence(10),
  });
  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });

  it('Verify user able to create New Course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.visitContentPage();
    NewCourse.getRoadMapsList();
    NewCourse.getCreateNewCourseButton();
    NewCourse.EnterCourseName();
    NewCourse.SelectCourseCategory();
    const course = generateRandomCourseTitle();
    cy.get('#addCourseForm_textarea_description').type(course.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Course created successfully.')
      .should('be.visible');
  });

  it('Verify user not able to create an empty course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.CourseCreationWithWhiteSpaces();
  });

  it('Verify user not able to create course with exceeded limit', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.CreateCourseWithLimitExceed();
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

  it('Verify user able to Edit course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.EditCourse();
    const course = generateRandomCourseTitle();
    cy.get('#addCourseForm_textarea_description').type(course.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Course updated successfully.')
      .should('be.visible');
  });

  it('Verify User able to Assign Existing Courses to course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.AssignExistingRoadmapsToCourses();
  });

  it('Verify user able to unassign existing courses from course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.UnassignExistingRoadmapsToCourses();
  });

  it('Verify user able to Delete the Course', () => {
    const NewCourse = new CreateNewCourse();
    NewCourse.DeleteCourse();
  });
});
