export class ArchiveRoadmaps {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getAccountSettings() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/archived/users"]').click();
  }

  openArchiveRoadmaps() {
    cy.get('[href="/dashboard/archived/roadmaps"]').click();
    cy.contains('Archived Roadmaps').should('be.visible');
  }

  getSearchRoadmap() {
    cy.get('.text-lg').contains('Archived Roadmaps').should('be.visible');
    cy.get('#default-search').type('Road');
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

  getActivateRoadmapList() {
    cy.get('.text-lg').contains('Archived Roadmaps').should('be.visible');
    cy.get('div.justify-end > button:nth-child(1)').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('div.mt-2 > div > p')
      .contains('Deactivated on')
      .should('be.visible');
  }

  getActivateRoadmapButton() {
    cy.get('.text-lg').contains('Archived Roadmaps').should('be.visible');
    cy.get('div.justify-end > button:nth-child(1)')
      .contains('Activate')
      .eq(0)
      .click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getActivateRoadmapMessage() {
    cy.get('div.Toastify__toast-body')
      .contains('Roadmap has been successfully restored')
      .should('be.visible');
  }

  getDeleteRoadmapList() {
    cy.get('.text-lg').contains('Archived Roadmaps').should('be.visible');
    cy.get('button.ml-4').each(($el, index) => {
      cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('div.mt-2 > div > p')
      .contains('Deactivated on')
      .should('be.visible');
  }

  getDeleteRoadmapButton() {
    cy.get('.text-lg').contains('Archived Roadmaps').should('be.visible');
    cy.get('button.ml-4').contains('Delete').eq(0).click();
    cy.get('button.text-white').contains("Yes, I'm sure").click();
  }

  getDeleteRoadmapMessage() {
    cy.get('div.Toastify__toast-body')
      .contains('Roadmap has been permanently deleted')
      .should('be.visible');
  }

  SearchRoadmap() {
    this.getAccountSettings();
    this.openArchiveRoadmaps();
    this.getSearchRoadmap();
  }

  ActivateRoadmap() {
    this.getAccountSettings();
    this.openArchiveRoadmaps();
    this.getActivateRoadmapList();
    this.getActivateRoadmapButton();
    this.getActivateRoadmapMessage();
  }

  DeleteRoadmap() {
    this.getAccountSettings();
    this.openArchiveRoadmaps();
    this.getDeleteRoadmapList();
    this.getDeleteRoadmapButton();
    this.getDeleteRoadmapMessage();
  }
}
