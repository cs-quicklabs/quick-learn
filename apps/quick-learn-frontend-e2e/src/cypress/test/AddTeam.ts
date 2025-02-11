export class AddTeam {
  visitTeamPage() {
    return cy.get('[href="/dashboard/teams"]');
  }

  getAddTeamButton() {
    return cy.get('.flex > .px-4');
  }

  getFirstName() {
    return cy.get('#first_name');
  }
  getLastName() {
    return cy.get('#last_name');
  }
  getEmail() {
    return cy.get('#email');
  }
  getUserTypeAdmin() {
    return cy.get('#user_type_id').select('Admin');
  }
  getUserTypeEditor() {
    return cy.get('#user_type_id').select('Editor');
  }

  generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@yopmail.com`;
  }

  getUserTypeMember() {
    return cy.get('#user_type_id').select('Member');
  }

  getPassword() {
    return cy.get('#password');
  }
  getConfirmPassword() {
    return cy.get('#confirm_password');
  }

  getSkillID() {
    return cy.get('#skill_id').select(2);
  }

  submitAddTeamButton() {
    return cy.get('#submit').click();
  }

  getErrorMessage() {
    return cy.get('p.mt-1');
  }

  fieldNameRequired() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('John');
    this.getFirstName().clear(); //clear the first name field
    this.getLastName().type('Doe');
    this.getLastName().clear(); //clear the last name field
    this.getEmail().type(mail);
    this.getEmail().clear(); //clear the email field
    this.getUserTypeAdmin();
    this.getPassword().type('Password@123');
    this.getPassword().clear(); //clear the password field
    this.getConfirmPassword().type('Pass');
    this.getConfirmPassword().clear(); //clear the confirm password field
    this.getSkillID();
  }
  validateFieldWithEmptySpaces() {
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('    ');
    this.getLastName().type('   ');
    this.getEmail().type('email');
    this.getEmail().clear();
    this.getEmail().type('  ');
    this.getUserTypeAdmin();
    this.getPassword().type('   ');
    this.getConfirmPassword().type('   ');
    this.getSkillID();
    cy.get('#submit').should('be.disabled');
  }
  InvalidDataTest() {
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('42435');
    this.getErrorMessage().should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    this.getFirstName().clear();
    this.getFirstName().type('$#@$#@@');
    this.getErrorMessage().should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    this.getLastName().type('43245356');
    this.getErrorMessage().should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    this.getLastName().clear();
    this.getLastName().type('@#@$#@@@');
    this.getErrorMessage().should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    cy.get('#submit').should('be.disabled');
  }

  SetInvalidPassword() {
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getPassword().type('pass@12w');
    this.getConfirmPassword().type('pass@12w');
    this.getErrorMessage().contains(
      'Password must contain at least one uppercase letter',
    );
    this.getPassword().clear();
    this.getPassword().type('PASSWORD');
    this.getErrorMessage().contains(
      'Password must contain at least one lowercase letter',
    );
    this.getPassword().clear();
    this.getPassword().type('Pass@word');
    this.getErrorMessage().contains(
      'Password must contain at least one number',
    );
    this.getPassword().clear();
    this.getPassword().type('Pass1234');
    this.getErrorMessage().contains(
      'Password must contain at least one special character',
    );
    this.getPassword().clear();
    this.getPassword().type('Password@123PasswordPasswordPassword');
    this.getErrorMessage().contains('The value should not exceed 32 characters');
    cy.get('#submit').should('be.disabled');
  }

  EnterPasswordWithDifferentNewAndConfirmPassword() {
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getPassword().type('Password@123');
    this.getConfirmPassword().type('Password@923P');
    this.getErrorMessage().contains("Passwords don't match");
    cy.get('#submit').should('be.disabled');
  }

  UpdatePasswordWithLesserLength() {
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getPassword().type('P@1s');
    this.getConfirmPassword().type('P@1s');
    this.getErrorMessage().contains(
      'Password must be at least 8 characters long',
    );
    cy.get('#submit').should('be.disabled');
  }
}
