export class CreateNewCourse {
  visitContentPage() {
    return cy.get('[href="/dashboard/content"]').click();
  }

  getRoadMapsList() {
    cy.get('.text-2xl').contains('All Roadmaps');
    cy.get('section div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('section div a').eq(0).click();
  }

  getCreateCoursesList() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(0).click();
  }

  getCreateAnotherCourseButton() {
    cy.get('.mt-2').contains('Create New Course').click();
  }

  EnterCourseName() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#addCourseForm_input_text').type('Course ' + Numeric);
  }

  SelectCourseCategory() {
    cy.contains('Course Category').should('be.visible');
    cy.get('#addCourseForm_select_course_category_id').select(2);
  }

  BlankCourseName() {
    cy.get('#addCourseForm_input_text').type('   ');
    cy.get('.mt-1').eq(0).contains('This field is mandatory');
  }

  BlankCourseDescription() {
    cy.get('#addCourseForm_textarea_description').type('   ');
    cy.get('.mt-1').eq(1).contains('This field is mandatory');
  }

  CourseNameWithExcessCharacters() {
    cy.get('#addCourseForm_input_text').type(
      'After 50 characters the limit exceeded message will be shown.',
    );
    cy.get('.mt-1')
      .eq(0)
      .contains('The value should not exceed 50 characters.');
  }

  getCourseListToEdit() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(0).click();
    cy.get('.text-lg').contains('No Lessons found');
  }

  UpdateCourseCategory() {
    cy.contains('Course Category').should('be.visible');
    cy.get('#addCourseForm_select_course_category_id').select(6);
  }
  getEditCoursebutton() {
    cy.get('p.text-sm').contains('created this roadmap on');
    cy.get('button.text-black').eq(0).click();
    cy.get('.text-lg').contains('Edit Course');
  }

  getSubmitButton() {
    return cy.get('[type="submit"]').click();
  }

  getCancelButton() {
    cy.get('button[type="button"]').contains('Cancel').click();
  }

  getSuccessMessage() {
    return cy
      .get('.Toastify__toast-body')
      .contains('Course created Successfully.')
      .should('be.visible');
  }

  getEditSuccessMessage() {
    return cy
      .get('.Toastify__toast-body')
      .contains('Course updated successfully.')
      .should('be.visible');
  }

  getAddOrMoveCourseButton() {
    cy.get('p.text-sm').contains('created this roadmap on');
    cy.get('button.text-black').eq(1).click();
    cy.get('.text-xl').contains('Add or Move this course to another Roadmap');
  }

  getAddOrMoveCoursesList() {
    cy.get('[id="brand-tab"]').contains('Select Roadmaps');
    cy.get('[data-testid="flowbite-accordion-heading"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[data-testid="flowbite-accordion-heading"]').eq(1).click();
  }

  EnsureExistingCoursesUnchecked() {
    cy.get('[type="checkbox"]')
      .eq(6)
      .then(($checkbox) => {
        if ($checkbox.is(':checked')) {
          cy.wrap($checkbox).uncheck();
        }
      });
  }
  clickExistingCourseCheckbox() {
    cy.get('[type="checkbox"]').eq(6).check();
  }

  getArchiveCourseButton() {
    cy.get('p.text-sm').contains('created this roadmap on');
    cy.get('button.text-black').eq(2).click();
    cy.contains("Yes, I'm sure").click();
  }
  getArchiveSuccessMessage() {
    return cy
      .get('.Toastify__toast-body')
      .contains('Course archived successfully.')
      .should('be.visible');
  }

  NewCourseCreation() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCreateAnotherCourseButton();
    this.EnterCourseName();
    this.SelectCourseCategory();
  }

  CourseCreationWithWhiteSpaces() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCreateAnotherCourseButton();
    this.BlankCourseName();
    this.SelectCourseCategory();
    this.BlankCourseDescription();
    this.getCancelButton();
  }
  CreateCourseWithLimitExceed() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCreateAnotherCourseButton();
    this.CourseNameWithExcessCharacters();
    this.SelectCourseCategory();
  }

  EditCourse() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getEditCoursebutton();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('#addCourseForm_input_text').clear();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    this.EnterCourseName();
    this.UpdateCourseCategory();
    cy.get('#addCourseForm_textarea_description').clear();
  }

  AssignExistingRoadmapsToCourses() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getAddOrMoveCourseButton();
    this.getAddOrMoveCoursesList();
    this.EnsureExistingCoursesUnchecked();
    this.clickExistingCourseCheckbox();
    this.getSubmitButton();
    this.getEditSuccessMessage();
  }

  UnassignExistingRoadmapsToCourses() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getAddOrMoveCourseButton();
    this.getAddOrMoveCoursesList();
    this.EnsureExistingCoursesUnchecked();
    cy.contains('Cancel').click();
  }

  DeleteCourse() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getArchiveCourseButton();
    this.getArchiveSuccessMessage();
  }
}
