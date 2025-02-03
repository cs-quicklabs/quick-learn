export class MyLearningPaths {
  visitMyLearningPathsPage() {
    return cy.get('#navDesktop1');
  }

  getMyRoadmapsList() {
    cy.get('.text-3xl').contains('My Roadmaps');
    cy.get('[tabindex="0"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[tabindex="0"]').eq(0).click();
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
    cy.get('[tabindex="0"]').eq(-2).click();
    cy.get('.text-3xl').contains('Lessons').should('be.visible');
  }

  getNoLessonList() {
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
  getOrHandleLessons() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("No lessons")').length > 0) {
        // No lessons found, navigate to My Learning Path
        cy.get('[href="/dashboard/learning-path"]')
          .contains('My Learning Path')
          .click();
        cy.get('h1.text-3xl').contains('My Roadmaps').should('be.visible');
      } else {
        // Lessons found, log them and click the first available lesson
        cy.get('.py-4').each(($el, index) => {
          cy.log(`Index: ${index}, Text: ${$el.text()}`);
        });
        cy.get('.py-4').eq(0).click();
        cy.get('li.text-gray-700')
          .contains('My Learning Path')
          .should('be.visible');
      }
    });
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
  }
  NavigateViaCourses() {
    this.visitMyLearningPathsPage();
    this.getMyCoursesList();
    this.getMyLessonsList();
    this.ensureMarkAsReadUnchecked();
  }

  MarkAsReadUnread() {
    this.visitMyLearningPathsPage().click();
    this.getMyRoadmapsList();
    this.getCoursesList();
    this.getLessonsList();
    this.ensureMarkAsReadUnchecked();
    this.clickMarkAsReadCheckbox();
    this.clickMarkAsUnread();
    this.ensureMarkAsReadUnchecked();
  }

  NoLessonFound() {
    this.visitMyLearningPathsPage().click();
    this.getNoLessonList();
    this.getOrHandleLessons();
  }
}
