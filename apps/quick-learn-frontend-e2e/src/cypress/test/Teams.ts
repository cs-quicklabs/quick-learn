/* eslint-disable cypress/no-unnecessary-waiting */
export class TeamsPage {
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

  getAdminList() {
    cy.wait(5000);
    cy.contains('Show All').should('be.visible');
    cy.get('#admin').click();
    cy.wait(8000);
    cy.contains('Role').should('be.visible');
    cy.get('td:nth-child(2) > div').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          cy.log(`Element ${index} text: ${text.trim()}`);
          expect(text.trim()).to.contain('Admin'); // Assert that the text contains the expected value 'admin'
        });
    });
  }
  getEditorList() {
    cy.wait(5000);
    cy.get('#editor').click();
    cy.contains('Editor').should('be.visible');
    cy.wait(10000);
    cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          cy.log(`Element ${index} text: ${text.trim()}`);
          expect(text.trim()).to.contain('Editor'); // Assert that the text contains the expected value 'Editor'
        });
    });
  }

  getMembersList() {
    cy.wait(5000);
    cy.get('#member').click();
    cy.wait(10000);
    cy.contains('Members').should('be.visible');
    cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          cy.log(`Element ${index} text: ${text.trim()}`);
          expect(text.trim()).to.contain('Member'); // Assert that the text contains the expected value 'Member'
        });
    });
  }
  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  searchUser() {
    cy.get('.flex > #search').type('Auto');
    cy.contains('User Automation').should('be.visible');
  }

  filterAdminList() {
    this.visitTeamPage().click();
    this.getAdminList();
  }

  filterEditorList() {
    this.visitTeamPage().click();
    this.getEditorList();
  }
  filterMembersList() {
    this.visitTeamPage().click();
    this.getMembersList();
  }
}
