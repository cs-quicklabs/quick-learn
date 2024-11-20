class AddTeam {
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
    return cy.get('#user_type_id').select('Admin');
  }

  generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@yopmail.com`;
  }

  getUserTypeMember() {
    return cy.get('#user_type_id').select('Admin');
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

  addTeam() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('Raj');
    this.getLastName().type('Gupta');
    this.getEmail().type(mail);
    this.getUserTypeAdmin();
    this.getPassword().type('Password@123');
    this.getConfirmPassword().type('Password@123');
    this.getSkillID();
    this.submitAddTeamButton();
  }

  fieldNameRequired() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.submitAddTeamButton();
  }
  validateFieldWithEmptySpaces() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('    ');
    this.getLastName().type('   ');
    this.getEmail().type('   ');
    this.getUserTypeAdmin();
    this.getPassword().type('   ');
    this.getConfirmPassword().type('   ');
    this.getSkillID('   ');
    this.submitAddTeamButton();
  }
}

module.exports = AddTeam;
