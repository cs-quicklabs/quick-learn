class addPrimarySkill {
  visitTeamPage() {
    return cy.get('[href="/dashboard/teams"]');
  }

  userMenu() {
    return cy.contains('Open user menu');
  }
  getAccountSettings() {
    return cy.contains('Account Settings');
  }
  openPrimarySkill() {
    return cy.contains('Primary Skills').click();
  }
  clickSkillField() {
    return cy.get('#primary_skills_input_text').click();
  }
  addPrimarySkill() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#primary_skills_input_text').type('ReactJs' + Numeric);
  }

  addPrimarySkillWithOnlySpaces() {
    return cy.get('#primary_skills_input_text').type('   ');
  }

  addPrimarySkillWithMoreCharacters() {
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
    cy.get('.ml-5').click();
    cy.get('td > .px-2').should('contain', 'This field is mandatory');
  }

  deletePrimarySkill() {
    cy.get(':nth-child(3) > .inline-flex > .ml-2').click();
  }
  getErrorMessage() {
    return cy.get('.mt-1');
  }

  saveButton() {
    return cy.get('.flex-wrap > .false').click();
  }

  OpenAccountSettings() {
    this.userMenu().click();
    this.getAccountSettings().click();
  }
}
module.exports = addPrimarySkill;
