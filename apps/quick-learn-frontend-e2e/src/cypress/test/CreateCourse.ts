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
    cy.get('p.text-sm')
      .contains('created this roadmap on')
      .should('be.visible');
  }

  getCreateNewCourseButton() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("No courses available")').length > 0) {
        cy.get('button.inline-flex')
          .contains('Create New Course')
          .should('be.visible')
          .click();
      } else {
        cy.get('button.inline-block')
          .contains('Create New Course')
          .should('be.visible')
          .click();
      }
    });
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
  }

  UpdateCourseCategory() {
    cy.contains('Course Category').should('be.visible');
    cy.get('#addCourseForm_select_course_category_id').select(1);
  }
  getEditCoursebutton() {
    cy.get('p.text-sm').contains('created this course on');
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
      .get('div.Toastify__toast')
      .contains('Course created Successfully.')
      .should('be.visible');
  }

  getEditSuccessMessage() {
    return cy
      .get('div.Toastify__toast')
      .contains('Course updated successfully.')
      .should('be.visible');
  }

  getAddOrMoveCourseButton() {
    cy.get('p.text-sm').contains('created this course on');
    cy.get('button.text-black').eq(1).click();
    cy.get('.text-xl').contains('Add or Move this course to another Roadmap');
  }

  getAddOrMoveCoursesList() {
    cy.get('[id="brand-tab"]').contains('Select Roadmaps');
    cy.get('#content_list_item').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('#content_list_item').eq(1).click();
  }

  EnsureExistingCoursesUnchecked() {
    cy.get('[type="checkbox"]')
      .eq(0)
      .then(($checkbox) => {
        if ($checkbox.is(':checked')) {
          cy.wrap($checkbox).uncheck();
        }
      });
  }
  clickExistingCourseCheckbox() {
    cy.get('[type="checkbox"]').eq(0).check();
  }

  getArchiveCourseButton() {
    cy.get('p.text-sm').contains('created this course on');
    cy.get('button.text-black').eq(2).click();
    cy.contains("Yes, I'm sure").click();
  }
  getArchiveSuccessMessage() {
    return cy
      .get('div.Toastify__toast')
      .contains('Course archived successfully.')
      .should('be.visible');
  }

  CourseCreationWithWhiteSpaces() {
    this.visitContentPage();
    this.getRoadMapsList();
    this.getCreateNewCourseButton();
    this.BlankCourseName();
    this.SelectCourseCategory();
    this.BlankCourseDescription();
    this.getCancelButton();
  }
  CreateCourseWithLimitExceed() {
    this.visitContentPage();
    this.getRoadMapsList();
    this.getCreateNewCourseButton();
    this.CourseNameWithExcessCharacters();
    this.SelectCourseCategory();
  }

  EditCourse() {
    this.visitContentPage();

    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getEditCoursebutton();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('#addCourseForm_input_text').clear();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    this.EnterCourseName();
    this.UpdateCourseCategory();
    cy.get('#addCourseForm_textarea_description').clear();
  }

  AssignExistingRoadmapsToCourses() {
    this.visitContentPage();

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

    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getAddOrMoveCourseButton();
    this.getAddOrMoveCoursesList();
    this.EnsureExistingCoursesUnchecked();
    cy.contains('Cancel').click();
  }

  DeleteCourse() {
    this.visitContentPage();
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getArchiveCourseButton();
    this.getArchiveSuccessMessage();
  }
}
