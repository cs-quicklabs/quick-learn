export class ArchiveUsers {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getAccountSettings() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/archived/users"]').click();
  }

  openArchiveUsers() {
    cy.get('[href="/dashboard/archived/users"]').click();
    cy.contains('Archived Users').should('be.visible');
  }

  getSearchUser() {
    cy.get('.text-lg').contains('Inactive Users').should('be.visible');
    cy.get('#default-search').type('User');
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

  getActivateUserList() {
    cy.get('.text-lg').contains('Inactive Users').should('be.visible');
    cy.get('div.justify-end > button:nth-child(1)').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('div.mt-2 > div > p')
      .contains('Deactivated on')
      .should('be.visible');
  }

  getActivateUserButton() {
    cy.get('.text-lg').contains('Inactive Users').should('be.visible');
    cy.get('div.justify-end > button:nth-child(1)')
      .contains('Activate')
      .eq(0)
      .click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getActivateUserMessage() {
    cy.get('div.Toastify__toast')
      .contains('User has been activated successfully')
      .should('be.visible');
  }

  getDeleteUserList() {
    cy.get('.text-lg').contains('Inactive Users').should('be.visible');
    cy.get('button.ml-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('div.mt-2 > div > p')
      .contains('Deactivated on')
      .should('be.visible');
  }

  getDeleteUserButton() {
    cy.get('.text-lg').contains('Inactive Users').should('be.visible');
    cy.get('button.ml-4').contains('Delete').eq(0).click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getDeleteUserMessage() {
    cy.get('div.Toastify__toast')
      .contains('User has been permanently deleted')
      .should('be.visible');
  }

  SearchUser() {
    this.getAccountSettings();
    this.openArchiveUsers();
    this.getSearchUser();
  }

  ActivateUser() {
    this.getAccountSettings();
    this.openArchiveUsers();
    this.getActivateUserList();
    this.getActivateUserButton();
    this.getActivateUserMessage();
  }

  DeleteUser() {
    this.getAccountSettings();
    this.openArchiveUsers();
    this.getDeleteUserList();
    this.getDeleteUserButton();
    this.getDeleteUserMessage();
  }
}
