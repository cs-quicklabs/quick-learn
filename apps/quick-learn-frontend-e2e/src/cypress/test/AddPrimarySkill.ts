import { getMenuBar } from '../support/app.po';

export class AddPrimarySkill {
  openPrimarySkill() {
    getMenuBar();
    cy.get('[href="/dashboard/account-settings"]').click();
    cy.get('[href="/dashboard/account-settings/primary-skills"]').click();
    cy.contains('Primary Skills').should('be.visible');
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

  AddPrimarySkillWithSpecialChar() {
    cy.get('#primary_skills_input_text').type('@#@#@$');
    cy.get('p.mt-1').should('contain', 'Special characters are not allowed');
    cy.get('.flex-wrap > .false').should('be.disabled');
  }

  AddPrimarySkillWithMoreCharacters() {
    return cy
      .get('#primary_skills_input_text')
      .type(
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem',
      );
  }

  editPrimarySkill() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type('React' + Numeric);
    cy.get('button.ml-5').click();
  }
  editPrimarySkillWithEmptySpaces() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type('    ');
    cy.get('button.ml-5').should('be.disabled');
    cy.get('td > .px-2').should('contain', 'This field is mandatory');
  }

  editPrimarySkillWithSpecialChars() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type('$#@$#@#$%');
    cy.get('button.ml-5').should('be.disabled');
    cy.get('td > .px-2').should(
      'contain',
      'Special characters are not allowed',
    );
  }

  EditPrimarySkillWithMoreCharacters() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#primary_skills_name_edit').clear();
    cy.get('#primary_skills_name_edit').type(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem',
    );
    cy.get('p.px-2').should(
      'contain',
      'The value should not exceed 30 characters.',
    );
  }

  getDeleteSkillButton() {
    cy.get('body').then(($body) => {
      if ($body.find('.text-lg:contains("Primary Skills")').length >= 0) {
        cy.get(':nth-child(1) > .inline-flex > .ml-2').click();
        cy.get('h3.text-lg').should('contain', 'Failed to delete skill');
        cy.get('button.bg-white.uppercase').click();
      } else {
        cy.get(':nth-child(1) > .inline-flex > .ml-2').click();
        cy.get('div.Toastify__toast--success').should(
          'contain',
          'Primary skill is deleted.',
        );
      }
    });
  }

  getErrorMessage() {
    return cy.get('.mt-1');
  }

  saveButton() {
    return cy.get('.flex-wrap > .false').click();
  }

  getSuccessMessage() {
    return cy.get('div.Toastify__toast--success');
  }
}
