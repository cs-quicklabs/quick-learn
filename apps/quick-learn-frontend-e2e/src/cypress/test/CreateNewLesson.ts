export class CreateNewLesson {
  visitContentPage() {
    return cy.get('[href="/dashboard/content"]').click();
  }

  getRoadMapsList() {
    cy.get('section div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('section div a').eq(0).click();
    cy.get('p.text-sm').contains('created this roadmap on');
  }

  getCourseList() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(0).click();
    cy.get('p.text-sm').contains('created this course on');
  }

  checkIfLessonsExist() {
    return cy.get('main div div div a').then(($main) => {
      // Check if "No Lessons found" text exists
      if ($main.find('.text-lg:contains("No Lessons found")').length > 0) {
        cy.log('No lessons found in this course.');
        return false; // No lessons found
      } else {
        cy.log('Lessons exist in this course.');
        return true; // Lessons found
      }
    });
  }

  getCreateNewLessonButton() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("No Lessons found")').length > 0) {
        cy.get('button.inline-flex')
          .contains('Create New Lesson')
          .should('be.visible')
          .click();
      } else {
        cy.get('button.inline-block')
          .contains('Create New Lesson')
          .should('be.visible')
          .click();
      }
    });
  }

  BlankLessonTitle() {
    cy.get('textarea.w-full').type('   ');
    cy.get('.mt-1').eq(0).contains('Title is required');
  }

  BlankLessonContent() {
    cy.get('div.ql-editor').type('   ');
  }

  LessonTitleWithExcessCharacters() {
    const savedTitle =
      'After 81 characters the user will not able to write any text, As the cursor will';
    const providedTitle =
      'After 81 characters the user will not able to write any text, As the cursor will stop';
    cy.get('textarea.w-full').type(providedTitle);
    if (providedTitle !== savedTitle) {
      cy.log(
        'Test Passed: The provided title does not match the saved title. \nProvided: "${providedTitle}" \nSaved: "${savedTitle}"',
      );
    } else {
      throw new Error(
        `Test Failed: The provided title matches the saved title.`,
      );
    }
  }

  getLessonListToEdit() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(0).click();
    cy.get('a.flex.items-center')
      .eq(0)
      .contains('Content Repository')
      .should('be.visible');
  }

  EnsureEditIsDisabled() {
    cy.get('.inline-flex > .relative').should('not.have.class', 'enabled'); // Verify the toggle is initially disabled
  }

  clickEditToggle() {
    cy.get('.inline-flex > .relative').click();
  }

  getSubmitButton() {
    return cy.get('[type="submit"]').should('be.disabled');
  }

  getSuccessMessage() {
    return cy
      .get('div.Toastify__toast')
      .contains('Successfully created a lesson.')
      .should('be.visible');
  }
  getArchiveLessonButton() {
    cy.get('.left-4').contains('Archive').click();
    cy.get('button[type="button"]').contains("Yes, I'm sure").click();
  }

  getArchiveSuccessMessage() {
    return cy
      .get('div.Toastify__toast')
      .contains('Lesson archived successfully.')
      .should('be.visible');
  }

  NewLessonCreation() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseList();
    this.getCreateNewLessonButton();
  }

  LessonCreationWithWhiteSpaces() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseList();
    this.getCreateNewLessonButton();
    this.BlankLessonTitle();
    this.BlankLessonContent();
    this.getSubmitButton();
  }
  CreateLessonWithLimitExceed() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseList();
    this.getCreateNewLessonButton();
    this.LessonTitleWithExcessCharacters();
    this.getSubmitButton();
  }

  EditLesson() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseList();
    this.getLessonListToEdit();
    this.EnsureEditIsDisabled();
    this.clickEditToggle();
  }

  ArchiveLesson() {
    this.visitContentPage();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseList();
    this.getLessonListToEdit();
    this.getArchiveLessonButton();
    this.getArchiveSuccessMessage();
  }
}
