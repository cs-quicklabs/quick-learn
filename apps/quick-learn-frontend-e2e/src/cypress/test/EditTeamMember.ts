/* eslint-disable cypress/no-unnecessary-waiting */
export class EditTeamMember {
  visitTeamPage() {
    return cy.get('[href="/dashboard/teams"]');
  }
  getColumnsData() {
    const expectedHeaders = [
      'User',
      'Role',
      'Email',
      'Primary Skill',
      'Status',
      'Last Login',
      'Added On',
    ];
    cy.wait(5000);
    cy.get('table thead tr th').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.contain(expectedHeaders[index]);
        });
    });
  }

  getTeamsList() {
    cy.get('td a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('td a').eq(1).click();
    cy.get('h3.text-lg').contains('No roadmaps assigned');
  }

  getAddTeamButton() {
    return cy.get('.flex > .px-4');
  }

  getFirstName() {
    return cy.get('#first_name');
  }
  getLastName() {
    return cy.get('#last_name');
  }

  getEmail() {
    return cy.get('#email');
  }

  generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@yopmail.com`;
  }

  getUserTypeAdmin() {
    return cy.get('#user_type_id').select('Admin');
  }

  getPassword() {
    return cy.get('#password');
  }
  getConfirmPassword() {
    return cy.get('#confirm_password');
  }

  submitAddTeamButton() {
    return cy.get('#submit').click();
  }
  getEditUserButton() {
    cy.get(':nth-child(1) > .text-black').click();
    cy.get('h1.text-lg').contains('Edit');
  }

  getUserTypeEditor() {
    return cy.get('#user_type_id').select('Editor');
  }

  getSkillID() {
    return cy.get('#skill_id').select(1);
  }

  getActiveInactiveID() {
    cy.get('[id="active"]').select('Inactive');
  }
  getSubmitButton() {
    cy.get('[type="submit"]').click();
  }

  submitDisabled() {
    cy.get('[type="submit"]').should('be.disabled');
  }
  getCancelButton() {
    cy.get('[id="cancel"]').click();
  }

  getFirstNameError() {
    cy.get('p.mt-1')
      .contains('First name should only contain alphabetic characters')
      .should('be.visible');
  }

  getLastNameError() {
    cy.get('p.mt-1')
      .contains('Last name should only contain alphabetic characters')
      .should('be.visible');
  }
  getUpdateSuccessMessage() {
    cy.get('.Toastify__toast-body')
      .contains('User successfully updated.')
      .should('be.visible');
  }

  getDeactivateButton() {
    cy.get('button.text-black').eq(0).click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getDeactiveMessage() {
    cy.get('.Toastify__toast-body')
      .contains('User deactivated successfully')
      .should('be.visible');
  }

  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  searchUser() {
    cy.get('.flex > #search').type('Admin');
    cy.get('body').then(($body) => {
      if ($body.find('td.px-4.py-2:contains("No result found")').length > 0) {
        cy.contains('No result found').should('be.visible');
      } else {
        cy.get('td a').eq(0).click();
      }
    });
  }

  ErrorValidation() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getEditUserButton();
    this.getFirstName().type('First Name');
    this.getFirstNameError();
    this.getLastName().type('Last Name');
    this.getLastNameError();
    this.submitDisabled();
    this.getCancelButton();
  }

  MarkUserInactive() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getEditUserButton();
    this.getActiveInactiveID();
    this.getSubmitButton();
    this.getUpdateSuccessMessage();
  }

  DeactivateUser() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getDeactivateButton();
    this.getDeactiveMessage();
  }
}
