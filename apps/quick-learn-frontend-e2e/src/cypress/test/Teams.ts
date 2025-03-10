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

  getTeamsList() {
    cy.get('td a').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('td a').eq(1).click();
    cy.get('h3.text-lg').contains('No roadmaps assigned');
  }

  getUserTypeEditor() {
    return cy.get('#user_type_id').select('Editor');
  }

  getSkillID() {
    return cy.get('#skill_id').select(1);
  }

  getCompleteList() {
    cy.get('#showAll').click();
    cy.contains('Super Admin').should('be.visible');
  }

  getAdminList() {
    cy.wait(5000);
    cy.get('#admin').click();
    cy.contains('Admin').should('be.visible');
    cy.wait(8000);
    cy.get('td:nth-child(2) > div').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          cy.log(`Admin ${index} text: ${text.trim()}`);
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
          cy.log(`Editor ${index} text: ${text.trim()}`);
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
          cy.log(`Member ${index + 1}: ${text.trim()}`);
          expect(text.trim()).to.contain('Member'); // Assert that the text contains the expected value 'Member'
        });
    });
  }

  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  searchUser() {
    cy.get('.flex > #search').type('Anishka');
    cy.get('body').then(($body) => {
      if ($body.find('td.px-4.py-2:contains("No result found")').length > 0) {
        cy.contains('No result found').should('be.visible');
      } else {
        cy.get('td a').eq(0).click();
      }
    });
  }

  filterCompleteList() {
    this.visitTeamPage().click();
    this.getCompleteList();
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
