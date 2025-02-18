export class MyLearningPaths {
  visitMyLearningPathsPage() {
    return cy
      .get('[href="/dashboard/learning-path"]')
      .contains('My Learning Paths');
  }

  getMyRoadmapsList() {
    cy.get('.text-3xl').contains('My Roadmaps');
    cy.get('[tabindex="0"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('h3.font-medium').eq(0).click();
    cy.get('li.text-gray-700')
      .contains('My Learning Path')
      .should('be.visible');
  }

  getCoursesList() {
    cy.get('.text-3xl').contains('My Courses');
    cy.get('.py-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.py-4').eq(0).click();
  }

  getLessonsList() {
    cy.get('.text-3xl').contains('Lessons').should('be.visible');
    cy.get('.py-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.py-4').eq(0).click();
    cy.get('li.text-gray-700')
      .contains('My Learning Path')
      .should('be.visible');
  }

  getMyCoursesList() {
    cy.get('.text-3xl').contains('My Courses');
    cy.get('[tabindex="0"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[tabindex="0"]').eq(-1).click();
    cy.get('.text-3xl').contains('Lessons').should('be.visible');
  }

  getMyLessonsList() {
    cy.get('.py-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.py-4').eq(0).click();
    cy.get('li.text-gray-700')
      .contains('My Learning Path')
      .should('be.visible');
  }

  ensureMarkAsReadUnchecked() {
    cy.get('input[type="checkbox"]').then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).uncheck();
      }
    });
  }
  clickMarkAsReadCheckbox() {
    cy.get('input[type="checkbox"]').check();
    cy.get('.font-bold').contains('Already completed!');
  }

  clickMarkAsUnread() {
    cy.get('.cursor-pointer').click();
    cy.contains('This lesson has been marked as unread').should('be.visible');
  }

  NavigateViaRoadMap() {
    this.visitMyLearningPathsPage().click();
    this.getMyRoadmapsList();
    this.getCoursesList();
    this.getLessonsList();
    this.ensureMarkAsReadUnchecked();
    this.clickMarkAsReadCheckbox();
    this.clickMarkAsUnread();
    this.ensureMarkAsReadUnchecked();
  }

  NavigateViaCourses() {
    this.visitMyLearningPathsPage();
    this.getMyCoursesList();
    this.getMyLessonsList();
    this.ensureMarkAsReadUnchecked();
    this.clickMarkAsReadCheckbox();
    this.clickMarkAsUnread();
    this.ensureMarkAsReadUnchecked();
  }
}
