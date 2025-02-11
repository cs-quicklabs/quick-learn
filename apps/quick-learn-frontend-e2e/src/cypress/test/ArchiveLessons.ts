/* eslint-disable cypress/no-unnecessary-waiting */
export class ArchiveLessons {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getAccountSettings() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/archived/users"]').click();
  }

  openArchiveLessons() {
    cy.get('[href="/dashboard/archived/lessons"]').click();
    cy.contains('Archived Lessons').should('be.visible');
  }

  getSearchLesson() {
    cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
    cy.get('#default-search').type('Lesson');

    cy.get('body').then(($body) => {
      if ($body.find('div.p-4').length > 0) {
        cy.get('div.p-4').should('have.length.greaterThan', 0);
        cy.log('Lessons found.');
        cy.get('div.p-4').each(($el, index) => {
          cy.log(`Index: ${index}, Text: ${$el.text()}`);
        });

        cy.get('div.mt-2 > div > p')
          .contains('Deactivated on')
          .should('be.visible');
      } else {
        cy.get('.text-lg').contains('No results found').should('exist');
        cy.log('No results found.');
      }
    });
  }

  getActivateLessonList() {
    cy.get('.text-lg')
      .contains('Archived Lessons')
      .then(($noLessons) => {
        if ($noLessons.find('.text-lg:contains("No lessons")').length > 0) {
          cy.log('No lesson found.');
        } else {
          cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
          cy.get('div.justify-end > button:nth-child(1)').each(($el, index) => {
            cy.log(`Index: ${index}, Text: ${$el.text()}`);
          });
          cy.get('div.mt-2 > div > p')
            .contains('Deactivated on')
            .should('be.visible');
          this.getActivateLessonButton();
          this.getActivateLessonMessage();
        }
      });
  }

  getActivateLessonButton() {
    cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
    cy.get('div.justify-end > button:nth-child(1)')
      .contains('Activate')
      .eq(0)
      .click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getActivateLessonMessage() {
    cy.get('div.Toastify__toast')
      .contains('Lesson has been successfully restored')
      .should('be.visible');
  }

  getDeleteLessonList() {
    cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
    cy.get('button.ml-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('div.mt-2 > div > p')
      .contains('Deactivated on')
      .should('be.visible');

    cy.get('.text-lg')
      .contains('Archived Lessons')
      .then(($noLessons) => {
        if ($noLessons.find('.text-lg:contains("No lessons")').length > 0) {
          cy.log('No lesson found.');
        } else {
          cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
          cy.get('button.ml-4').each(($el, index) => {
            cy.log(`Index: ${index}, Text: ${$el.text()}`);
          });
          cy.get('div.mt-2 > div > p')
            .contains('Deactivated on')
            .should('be.visible');
          this.getDeleteLessonButton();
          this.getDeleteLessonMessage();
        }
      });
  }

  getDeleteLessonButton() {
    cy.get('.text-lg').contains('Archived Lessons').should('be.visible');
    cy.get('button.ml-4').contains('Delete').eq(0).click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getDeleteLessonMessage() {
    cy.get('div.Toastify__toast')
      .contains('Lesson has been permanently deleted')
      .should('be.visible');
  }

  SearchLesson() {
    this.getAccountSettings();
    this.openArchiveLessons();
    this.getSearchLesson();
  }

  ActivateLesson() {
    this.getAccountSettings();
    this.openArchiveLessons();
    this.getActivateLessonList();
    this.getActivateLessonButton();
    this.getActivateLessonMessage();
  }

  DeleteLesson() {
    this.getAccountSettings();
    this.openArchiveLessons();
    this.getDeleteLessonList();
    this.getDeleteLessonButton();
    this.getDeleteLessonMessage();
  }
}
