export class AddRoadMap {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getAccountSettings() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
  }

  openRoadMap() {
    cy.get('[href="/dashboard/account-settings/roadmap-categories"]').click();
    cy.contains('Roadmap Categories').should('be.visible');
  }

  clickRoadmapField() {
    return cy.get('#roadmap_categories_input_text').click();
  }
  AddRoadMapCategories() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#roadmap_categories_input_text').type('ReactJs' + Numeric);
  }

  AddRoadMapCategoriesWithOnlySpaces() {
    return cy.get('#roadmap_categories_input_text').type('    ');
  }

  AddRoadmapCategoryWithSpecialChar() {
    cy.get('#roadmap_categories_input_text').type('@#@#@$');
    cy.get('p.mt-1').should('contain', 'Special characters are not allowed');
    cy.get('.flex-wrap > .false').should('be.disabled');
  }

  AddRoadMapCategoriesWithMoreLimit() {
    return cy
      .get('#roadmap_categories_input_text')
      .type(
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      );
  }

  editRoadmapCategories() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#roadmap_categories_name_edit').clear();
    cy.get('#roadmap_categories_name_edit').type('React' + Numeric);
    cy.get('.ml-5').click();
  }
  editRoadmapCategoriesWithEmptySpaces() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#roadmap_categories_name_edit').clear();
    cy.get('#roadmap_categories_name_edit').type('    ');
    cy.get('.ml-5').should('be.visible');
    cy.get('td > .px-2').should('contain', 'This field is mandatory');
  }
  EditRoadmapCategoryWithSpecialChar() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#roadmap_categories_name_edit').clear();
    cy.get('#roadmap_categories_name_edit').type('@#@#@$');
    cy.get('p.px-2').should('contain', 'Special characters are not allowed');
    cy.get('.flex-wrap > .false').should('be.disabled');
  }

  EditRoadMapCategoriesWithMoreLimit() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#roadmap_categories_name_edit').clear();
    cy.get('#roadmap_categories_name_edit').type(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    );
    cy.get('p.px-2').should(
      'contain',
      'The value should not exceed 30 characters.',
    );
  }
  deleteRoadMap() {
    cy.get(':nth-child(2) > .inline-flex > .ml-2').click();
  }
  getErrorMessage() {
    return cy.get('.mt-1');
  }

  deleteRoadMapCategories() {
    cy.get(':nth-child(1) > .inline-flex > .ml-2').click();
    cy.get('[class="flex-1 overflow-auto p-0"]');
    cy.get('button.bg-white.uppercase').click();
  }

  OpenAccountSettings() {
    this.getAccountSettings();
  }

  getSuccessMessage() {
    return cy.get('div.Toastify__toast--success');
  }

  saveButton() {
    return cy.get('.flex-wrap > .false').click();
  }
}
