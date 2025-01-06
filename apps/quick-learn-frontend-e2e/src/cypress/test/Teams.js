class Teams {
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
  
    // cy.get('section.bg-white.shadow-md').should('exist');
    // cy.get('Show records only for:').should('be.visible');
    // cy.contains('table thead tr th');
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
    // cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          // Log the text for debugging purposes
        cy.log(`Element ${index} text: ${text.trim()}`);
          // Assert that the text contains the expected value 'admin'
          expect(text.trim()).to.contain("Admin");
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
          // Assert that the text contains the expected value 'Editor'
          expect(text.trim()).to.contain('Editor'); 
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
          // Assert that the text contains the expected value 'Member'
          expect(text.trim()).to.contain('Member');
        });
    });
  }
  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  searchUser() {
    cy.get('.flex > #search').type('Auto');
    // cy.wait(5000);
    cy.contains('User Automation').should('be.visible');

    // cy.get('table tbody tr:nth-child(1) td:nth-child(1)')
    // .should('have.text', 'User Automation');
      // .invoke('text')
      // .then((text) => {
      //   expect(text.trim()).to.equal('Anishkaa Rai');
      // });
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
module.exports = Teams;
