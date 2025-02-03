export class ArchiveCourses {
    visitAccountsPage() {
      return cy.get('[id="headerProfileImage"]').click();
    }
    getAccountSettings() {
      cy.get('[id="headerProfileImage"]').click();
      cy.get('[href="/dashboard/archived/users"]').click();
    }
  
    openArchiveCourses() {
      cy.get('[href="/dashboard/archived/courses"]').click();
      cy.contains('Archived Courses').should('be.visible');
    }
  
    getSearchCourse() {
      cy.get('.text-lg').contains('Archived Courses').should('be.visible');
      cy.get('#default-search').type('Course');
      cy.get('body').then(($body) => {
        if ($body.find('h3.text-lg:contains("No results found")').length > 0) {
          cy.contains('No results found').should('be.visible');
        } else {
          cy.get('div.p-4').each(($el, index) => {
            cy.log(`Index: ${index}, Text: ${$el.text()}`);
          });
          cy.get('div.p-4').eq(0);
          cy.get('div.mt-2 > div > p')
            .contains('Deactivated on')
            .should('be.visible');
        }
      });
    }
  
    getActivateCourseList() {
      cy.get('.text-lg').contains('Archived Courses').should('be.visible');
      cy.get('div.justify-end > button:nth-child(1)').each(($el, index) => {
        cy.log(`Index: ${index}, Text: ${$el.text()}`);
      });
      cy.get('div.mt-2 > div > p')
        .contains('Deactivated on')
        .should('be.visible');
    }
  
    getActivateCourseButton() {
      cy.get('.text-lg').contains('Archived Courses').should('be.visible');
      cy.get('div.justify-end > button:nth-child(1)')
        .contains('Activate')
        .eq(0)
        .click();
      cy.get('button.text-white').contains("Yes, I'm sure").click();
    }
  
    getActivateCourseMessage() {
      cy.get('div.Toastify__toast-body')
        .contains('Course has been restored successfully')
        .should('be.visible');
    }
  
    getDeleteCourseList() {
      cy.get('.text-lg').contains('Archived Courses').should('be.visible');
      cy.get('button.ml-4').each(($el, index) => {
        cy.log(`Index: ${index}, Text: ${$el.text()}`);
      });
      cy.get('div.mt-2 > div > p')
        .contains('Deactivated on')
        .should('be.visible');
    }
  
    getDeleteCourseButton() {
      cy.get('.text-lg').contains('Archived Courses').should('be.visible');
      cy.get('button.ml-4').contains('Delete').eq(0).click();
      cy.get('button.text-white').contains("Yes, I'm sure").click();
    }
  
    getDeleteCourseMessage() {
      cy.get('div.Toastify__toast-body')
        .contains('Course has been permanently deleted')
        .should('be.visible');
    }
  
    SearchCourse() {
      this.getAccountSettings();
      this.openArchiveCourses();
      this.getSearchCourse();
    }
  
    ActivateCourse() {
      this.getAccountSettings();
      this.openArchiveCourses();
      this.getActivateCourseList();
      this.getActivateCourseButton();
      this.getActivateCourseMessage();
    }
  
    DeleteCourse() {
      this.getAccountSettings();
      this.openArchiveCourses();
      this.getDeleteCourseList();
      this.getDeleteCourseButton();
      this.getDeleteCourseMessage();
    }
  }
  