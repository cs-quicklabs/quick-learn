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
    cy.get('h2.text-2xl').contains('Roadmaps');
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

  SubmitDisabled() {
    cy.get('[type="submit"]').should('be.disabled');
  }
  getEditCancelButton() {
    cy.get('#cancel').click();
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

  getErrorMessage() {
    return cy.get('p.mt-1');
  }

  getUpdateSuccessMessage() {
    cy.get('div.Toastify__toast')
      .contains('User successfully updated.')
      .should('be.visible');
  }

  getDeactivateButton() {
    cy.get('button.text-black').eq(0).click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getDeactiveMessage() {
    cy.get('div.Toastify__toast')
      .contains('User deactivated successfully')
      .should('be.visible');
  }

  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  getAssignUnassignButton() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("No roadmaps assigned")').length > 0) {
        cy.get('button.px-4.py-2')
          .contains('Assign/Unassign Roadmap')
          .should('be.visible')
          .click();
      } else {
        cy.get('button.inline-block')
          .contains('Assign/Unassign Roadmap')
          .should('be.visible')
          .click();
      }
    });
  }
  getRoadmapsList() {
    cy.get('[id="brand-tab"]').contains('Select Roadmaps');
    cy.get('[data-testid="flowbite-accordion-heading"]').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('[data-testid="flowbite-accordion-heading"]').eq(0).dblclick();
  }

  EnsureRoadmapsUnchecked() {
    cy.get('[type="checkbox"]')
      .eq(0)
      .then(($checkbox) => {
        if ($checkbox.is(':checked')) {
          cy.wrap($checkbox).uncheck();
        }
      });
  }
  clickRoadmapsCheckbox() {
    cy.get('[type="checkbox"]').eq(0).check();
  }

  getCancelButton() {
    cy.get('button[type="button"]').contains('Cancel').click();
  }

  getAssignUnassignSuccessMessage() {
    return cy
      .get('div.Toastify__toast')
      .should('contain', 'Successfully updated assigned courses.');
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
    this.getFirstName().clear();
    this.getFirstName().type('First  Name');
    this.getFirstNameError();
    this.getLastName().clear();
    this.getLastName().type('Last  Name');
    this.getLastNameError();
    this.SubmitDisabled();
    this.getCancelButton();
  }

  InvalidDataTest() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getEditUserButton();
    this.getFirstName().clear();
    this.getFirstName().type('42435');
    this.getErrorMessage().should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    this.getFirstName().clear();
    this.getFirstName().type('$#@$#@@');
    this.getErrorMessage().should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    this.getLastName().clear();
    this.getLastName().type('43245356');
    this.getErrorMessage().should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    this.getLastName().clear();
    this.getLastName().type('@#@$#@@@');
    this.getErrorMessage().should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    this.getEmail().clear();
    this.getEmail().type('joh@yo.c');
    this.getErrorMessage().should('contain', 'Invalid email address');
    this.SubmitDisabled();
  }
  validateFieldWithEmptySpaces() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getEditUserButton();
    this.getFirstName().clear();
    cy.wait(500);
    this.getFirstName().type('  ');
    this.getErrorMessage().should('contain', 'This field is required');
    this.getLastName().clear();
    this.getLastName().type('  ');
    this.getErrorMessage().should('contain', 'This field is required');
    this.getEmail().type('email');
    this.getEmail().clear();
    this.getEmail().type('  ');
    this.getErrorMessage().should('contain', 'This field is required');
    this.SubmitDisabled();
    this.getCancelButton();
  }

  AssignRoadmap() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getAssignUnassignButton();
    this.getRoadmapsList();
    this.EnsureRoadmapsUnchecked();
    this.clickRoadmapsCheckbox();
    this.getSubmitButton();
    this.getAssignUnassignSuccessMessage();
  }

  UnassignRoadmap() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getAssignUnassignButton();
    this.getRoadmapsList();
    this.EnsureRoadmapsUnchecked();
    this.clickRoadmapsCheckbox();
    this.EnsureRoadmapsUnchecked();
    this.getSubmitButton();
    this.getAssignUnassignSuccessMessage();
  }

  SaveDisable() {
    this.visitTeamPage().click();
    this.getTeamsList();
    this.getAssignUnassignButton();
    this.getRoadmapsList();
    this.EnsureRoadmapsUnchecked();
    this.clickRoadmapsCheckbox();
    this.EnsureRoadmapsUnchecked();
    this.SubmitDisabled();
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
