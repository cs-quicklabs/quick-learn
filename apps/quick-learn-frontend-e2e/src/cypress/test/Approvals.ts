export class Approvals {
  visitContentPageViaEditor() {
    return cy.get('[href="/dashboard/content"]');
  }

  visitApprovalsPageViaSAdmin() {
    return cy.get('[href="/dashboard/approvals"]');
  }

  getRoadmapList() {
    cy.get('.text-2xl').contains('All Roadmaps');
    cy.get('section div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('section div a').eq(0).click();
    cy.get('.mt-2').contains('Create New Course').should('be.visible');
  }

  getCourseList() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(1).click();
    cy.get('.mt-2').contains('Create New Lesson').should('be.visible');
  }

  getLessonList() {
    cy.get('main div div div a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('main div div div a').eq(2).click();
    cy.get('li.text-gray-700')
      .contains('Content Repository')
      .should('be.visible');
  }

  getPendingApprovalList() {
    cy.get('[class="inline-flex items-center"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[class="inline-flex items-center"]').eq(0).click();
    cy.get('.text-lg').contains('Approval pending!').should('be.visible');
  }

  EnsureEditIsDisabled() {
    cy.get('.inline-flex > .relative').should('not.have.class', 'enabled'); // Verify the toggle is initially disabled
  }

  clickEditToggle() {
    cy.get('.inline-flex > .relative').click();
  }

  EditLessonContent() {
    cy.get('#addRoadmapForm_textarea_description').type(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    );
  }

  getSendForApproval() {
    cy.get('button[type="submit"]').click();
    cy.contains('Successfully updated a lesson.').should('be.visible');
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

  getSignOutButton() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('.py-1').eq(2).contains('Sign out').click();
    cy.get('button[type="button"]').contains('Yes').click();
  }

  SendForApprovalViaEditor() {
    this.visitContentPageViaEditor().click();
    this.getRoadmapList();
    this.getCourseList();
    this.getLessonList();
    this.EnsureEditIsDisabled();
    this.clickEditToggle();
    this.EditLessonContent();
    this.getSendForApproval();
    cy.contains('Create New Lesson').should('be.visible');
    this.getSignOutButton();
  }

  DoNotApprovePendingApprovalLessons() {
    this.visitContentPageViaEditor().click();
    this.getRoadmapList();
    this.getCourseList();
    this.getPendingApprovalList();
    this.visitContentPageViaEditor().click();
    this.getSignOutButton();
  }

  ApproveLessonViaSuperAdmin() {
    this.visitApprovalsPageViaSAdmin().click();
    cy.contains('Lessons Approvals').should('be.visible');
    cy.get('.ml-2').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('.ml-2').eq(0).click();
    cy.get('li.text-gray-700').contains('Approvals').should('be.visible');
    this.EnsureApproveLessonUnchecked();
    this.clickApproveLessonCheckbox();
    cy.contains('Lessons Approvals').should('be.visible');
    this.getSignOutButton();
  }
}
