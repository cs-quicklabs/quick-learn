/* eslint-disable cypress/no-unnecessary-waiting */
export class Flagged {
  VisitFlaggedPage() {
    cy.get('[href="/dashboard/flagged"]').click();
    cy.get('h1.mr-3').contains('Flagged Lessons').should('be.visible');
  }

  getFlagColumnsData() {
    const expectedHeaders = [
      'Lesson',
      'Updated on',
      'Created on',
      'Flagged on',
      'Flagged by',
    ];

    cy.wait(500);
    cy.get('table thead tr th').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.contain(expectedHeaders[index]);
        });
    });
  }

  getFlaggedLessonList() {
    this.VisitFlaggedPage();
    this.getFlagColumnsData();
    cy.get('a.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('a.ml-2').eq(0).click();
    cy.get('p.mt-1.ml-1').contains('added this lesson on').should('be.visible');
  }

  EnsureUnflagLessonUnchecked() {
    cy.get('input[type="checkbox"]').then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).uncheck();
      }
    });
  }
  clickUnflagLessonCheckbox() {
    cy.get('input[type="checkbox"]').check();
  }

  getUnflagLessonSuccessMessage() {
    return cy
      .get('div.Toastify__toast--success')
      .should('contain', 'Successfully unflagged the lesson.');
  }

  getSearchFlaggedLesson() {
    cy.get('#search').type('Lesson');
    cy.get('body').then(($body) => {
      if ($body.find('td.px-4.py-2:contains("No result found")').length >= 0) {
        cy.contains('No result found').should('be.visible');
      } else {
        cy.get('a.ml-2').eq(0).click();
      }
    });
  }

  SearchFlaggedLesson() {
    this.VisitFlaggedPage();
    this.getSearchFlaggedLesson();
  }

  getFlaggedLessonColumnData() {
    this.VisitFlaggedPage();
    this.getFlagColumnsData();
  }

  UnflagLessonViaSuperAdmin() {
    this.VisitFlaggedPage();
    cy.get('.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.ml-2').eq(0).click();
    cy.get('div.max-w-fit')
      .contains('The Lesson is flagged by')
      .should('be.visible');
    this.EnsureUnflagLessonUnchecked();
    this.clickUnflagLessonCheckbox();
    this.getUnflagLessonSuccessMessage();
  }

  BreadCrumbsUnclickable() {
    this.VisitFlaggedPage();
    cy.get('.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.ml-2').eq(0).click();
    cy.get('a.flex.items-center')
      .contains('Flagged Lessons')
      .should('be.visible');
    cy.get('span.flex.items-center').eq(0).click({ force: true });
    cy.get('span.flex.items-center').eq(0).should('exist');
    cy.get('span.flex.items-center').eq(1).click({ force: true });
    cy.get('span.flex.items-center').eq(1).should('exist');
  }

  CannotUnflagViaEditor() {
    this.VisitFlaggedPage();
    this.getFlagColumnsData();
    this.getFlaggedLessonList();
    cy.contains('Unflag Lesson').should('not.exist');
  }

  getFlaggedandListCount() {
    cy.get('div.h-5.w-5')
      .eq(4) // Replace with actual selector
      .invoke('text')
      .then((badgeCount) => {
        const flaggedCount = parseInt(badgeCount.trim(), 10);

        cy.get('a.ml-2') // Replace with actual selector for lesson rows
          .should('have.length', flaggedCount);

        cy.get(' div:nth-child(1) > p > span') // Replace with actual selector for "Showing X of Y"
          .invoke('text')
          .should('include', `${flaggedCount} of ${flaggedCount}`);
      });
  }

  MatchFlagAndListCount() {
    this.VisitFlaggedPage();
    this.getFlaggedandListCount();
  }
}
