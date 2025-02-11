/* eslint-disable cypress/no-unnecessary-waiting */
export class Approvals {
  VisitContentPageViaEditor() {
    return cy.get('[href="/dashboard/content"]');
  }

  getCreateNewRoadMap() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("No roadmaps available")').length > 0) {
        cy.get('button.inline-flex')
          .contains('Create New Roadmap')
          .should('be.visible')
          .click();
      } else {
        cy.get('button.inline-block')
          .contains('Create New Roadmap')
          .should('be.visible')
          .click();
      }
    });
  }

  EnterRoadMapName() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#addRoadmapForm_input_text').type('RoadMap ' + Numeric);
  }

  SelectRoadMapCategory() {
    cy.contains('Roadmap Category').should('be.visible');
    cy.get('#addRoadmapForm_select_roadmap_category_id').select(1);
  }

  getRoadMapsList() {
    cy.get('.text-2xl').contains('All Roadmaps');
    cy.get('section div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('section div a').eq(0).click();
    cy.wait(500);
    cy.get('h2.text-2xl').contains('All Courses').should('be.visible');
  }

  RoadmapCreationViaEditor() {
    this.VisitContentPageViaEditor().click();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getCreateNewRoadMap();
    this.EnterRoadMapName();
    this.SelectRoadMapCategory();
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

  getCourseListToEdit() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(0).click();
    cy.get('h2.text-2xl').contains('All Lessons').should('be.visible');
  }

  CourseCreationViaEditor() {
    this.VisitContentPageViaEditor().click();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCreateNewCourseButton();
    this.EnterCourseName();
    this.SelectCourseCategory();
  }

  getCreationSuccessMessage() {
    return cy.get('div.Toastify__toast--success');
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

  getSendForApproval() {
    cy.get('button[type="submit"]').click();
    cy.contains('Successfully updated a lesson.').should('be.visible');
  }

  SaveAndSendForApproval() {
    this.VisitContentPageViaEditor().click();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getCreateNewLessonButton();
  }

  EditApprovalPendingLesson() {
    this.VisitContentPageViaEditor().click();
    cy.get('.text-2xl').contains('All Roadmaps');
    this.getRoadMapsList();
    this.getCourseListToEdit();
    this.getPendingApprovalList();
    this.getEditButton();
    this.EnsureEditIsDisabled();
    this.clickEditToggle();
  }

  getPendingApprovalList() {
    cy.get('[class="inline-flex items-center"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[class="inline-flex items-center"]').eq(0).click();
    cy.get('.text-lg').contains('Approval pending!').should('be.visible');
  }

  getEditButton() {
    return cy.get('span.fixed.flex').contains('| Edit').click();
  }

  EnsureEditIsDisabled() {
    cy.get('.inline-flex > .relative').should('not.have.class', 'enabled'); // Verify the toggle is initially disabled
  }

  clickEditToggle() {
    cy.get('.inline-flex > .relative').click();
  }

  getSubmitDisable() {
    return cy.get('[type="submit"]').should('be.disabled');
  }

  VisitApprovalsPageViaSuperAdmin() {
    return cy.get('[href="/dashboard/approvals"]');
  }

  getColumnsData() {
    const expectedHeaders = [
      'Lesson',
      'Updated on',
      'Created on',
      'Created by',
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

  getApprovalLessonList() {
    cy.get('h1.mr-3').contains('Lessons Approvals').should('be.visible');
    cy.get('a.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('a.ml-2').eq(0).click();
    cy.get('p.mt-1.ml-1').contains('added this lesson on').should('be.visible');
  }

  EnsureApproveLessonUnchecked() {
    cy.get('input[id="default-checkbox"]').then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).uncheck();
      }
    });
  }
  clickApproveLessonCheckbox() {
    cy.get('input[id="default-checkbox"]').check();
  }

  getApproveSuccessMessage() {
    return cy
      .get('div.Toastify__toast--success')
      .should('contain', 'Successfully approved a lesson.');
  }

  getApprovalColumnData() {
    this.VisitApprovalsPageViaSuperAdmin().click();
    cy.contains('Lessons Approvals').should('be.visible');
    this.getColumnsData();
  }

  ApproveLessonViaSuperAdmin() {
    this.VisitApprovalsPageViaSuperAdmin().click();
    cy.contains('Lessons Approvals').should('be.visible');
    cy.get('.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.ml-2').eq(0).click();
    cy.get('li.text-gray-700').contains('Approvals').should('be.visible');
    this.EnsureApproveLessonUnchecked();
    this.clickApproveLessonCheckbox();
    cy.contains('Lessons Approvals').should('be.visible');
  }

  BreadCrumbsUnclickable() {
    this.VisitApprovalsPageViaSuperAdmin().click();
    cy.contains('Lessons Approvals').should('be.visible');
    cy.get('.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.ml-2').eq(0).click();
    cy.get('li.text-gray-700').contains('Approvals').should('be.visible');
    cy.get('span.flex.items-center').eq(0).click({ force: true });
    cy.get('span.flex.items-center').eq(0).should('exist');
    cy.get('span.flex.items-center').eq(1).click({ force: true });
    cy.get('span.flex.items-center').eq(1).should('exist');
  }
}
