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

    cy.get('table thead tr th').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.contain(expectedHeaders[index]);
        });
    });
  }

  getAdminList() {
    cy.get('#admin').click();
    cy.wait(5000);
    cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          // Assert that the text contains the expected value 'admin'
          expect(text.trim()).to.contain('Admin');
        });
    });
  }
  getEditorList() {
    cy.get('#editor').click();
    cy.wait(5000);
    cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          // Assert that the text contains the expected value 'admin'
          expect(text.trim()).to.contain('Editor');
        });
    });
  }

  getMemberList() {
    cy.get('#member').click();
    cy.wait(5000);
    cy.get('table tbody tr td:nth-child(2)').each(($el, index) => {
      cy.wrap($el)
        .invoke('text')
        .then((text) => {
          // Assert that the text contains the expected value 'admin'
          expect(text.trim()).to.contain('Member');
        });
    });
  }
  getTeamsColumnData() {
    this.visitTeamPage().click();
    this.getColumnsData();
  }

  searchUser() {
    cy.get('.flex > #search').type('Raj');

    cy.get('table tbody tr:nth-child(1) td:nth-child(1)')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal('Raj Gupta');
      });
  }

  filterAdminList() {
    this.visitTeamPage().click();
    this.getAdminList();
  }

  filterEditorList() {
    this.visitTeamPage().click();
    this.getEditorList();
  }
  filterMemberList() {
    this.visitTeamPage().click();
    this.getMemberList();
  }
}
module.exports = Teams;
