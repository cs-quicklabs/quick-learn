export class AddPrimarySkill {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }

  getAccountSettings() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
  }
  openPrimarySkill() {
    return cy.contains('Primary Skills').click();
  }
  clickSkillField() {
    return cy.get('#primary_skills_input_text').click();
  }
  AddPrimarySkill() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#primary_skills_input_text').type('ReactJs' + Numeric);
  }

  AddPrimarySkillWithOnlySpaces() {
    return cy.get('#primary_skills_input_text').type('   ');
  }

  AddPrimarySkillWithMoreCharacters() {
    return cy
      .get('#primary_skills_input_text')
      .type(
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      );
  }
  editPrimarySkill() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type('React' + Numeric);
    cy.get('.ml-5').click();
  }
  editPrimarySkillWithEmptySpaces() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type('    ');
    cy.get('.ml-5').should('be.disabled');
    cy.get('td > .px-2').should('contain', 'This field is mandatory');
  }

  deletePrimarySkill() {
    cy.get(':nth-child(3) > .inline-flex > .ml-2').click();
  }
  deleteSkillCategories() {
    cy.get(':nth-child(1) > .inline-flex > .ml-2').click();
    cy.get('[class="flex-1 overflow-auto p-0"]');
    cy.get('button.bg-white.uppercase').click();
  }
  getErrorMessage() {
    return cy.get('.mt-1');
  }

  saveButton() {
    return cy.get('.flex-wrap > .false').click();
  }

  OpenAccountSettings() {
    this.getAccountSettings();
  }
}
