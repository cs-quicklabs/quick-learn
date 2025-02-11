import { LoginPage } from '../test/Login';
import { CreateNewRoadMap } from '../test/CreateRoadMap';
import { validCredentials } from '../fixtures/credential';
import { faker } from '@faker-js/faker';

describe('New RoadMap Creation', () => {
  const loginPage = new LoginPage();
  const generateRandomLesson = () => ({
    title: faker.lorem.sentence(10),
  });
  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });

  it('Verify user able to create Roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.NewRoadmapCreation();
    const lesson = generateRandomLesson();
    cy.get('#addRoadmapForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Roadmap created Successfully.')
      .should('be.visible');
  });

  it('Verify user not able to create empty roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.RoadMapWithWhiteSpaces();
  });

  it('Verify user not able to create roadmap without selecting any category', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.ValidationTest();
    const lesson = generateRandomLesson();
    cy.get('#addRoadmapForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').should('be.disabled');
  });

  it('Verify user not able to create roadmap with exceeded limit', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.CreateRoadmapWithLimitExceed();
    const longText = faker.lorem.paragraphs(200);
    cy.get('#addRoadmapForm_textarea_description').invoke('val', longText);
    cy.get('#addRoadmapForm_textarea_description').type(
      'A short initial input ',
    );
    cy.get('.mt-1')
      .eq(1)
      .contains('The value should not exceed 5000 characters.');
    cy.get('button[type="button"]').contains('Cancel').click();
  });

  it('Verify user able to Edit roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.EditRoadMap();
    const lesson = generateRandomLesson();
    cy.get('#addRoadmapForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Roadmap updated successfully.')
      .should('be.visible');
  });

  it('Verify User able to Assign Existing Courses to Roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.AssignExistingCoursesToRoadMap();
  });

  it('Verify user able to unassign existing courses from roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.UnassignExistingCoursesToRoadMap();
  });

  it('Verify user able to Delete the Roadmap', () => {
    const NewRoadmap = new CreateNewRoadMap();
    NewRoadmap.DeleteRoadMap();
  });

  it('Verify user able to create a new course', () => {
    const NewCourse = new CreateNewRoadMap();
    NewCourse.NewCourseCreation();
    const lesson = generateRandomLesson();
    cy.get('#addCourseForm_textarea_description').type(lesson.title);
    cy.get('[type="submit"]').click();
    cy.get('div.Toastify__toast')
      .contains('Course created successfully.')
      .should('be.visible');
  });
});
