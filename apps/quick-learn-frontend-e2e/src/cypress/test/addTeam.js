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
    //return cy.get('#user_type_id').select('Editor');
  }

  generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@yopmail.com`;
  }

  getUserTypeMember() {
    return cy.get('#user_type_id').select('Admin');
    //return cy.get('#user_type_id').select('Member');
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
    cy.wait(5000);
    return cy.get('#submit').click();
  }

  addTeam() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('User');
    this.getLastName().type('Automation');
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
    this.getFirstName().type('John');
    this.getFirstName().clear(); //clear the first name field
    this.getLastName().type('Doe');
    this.getLastName().clear(); //clear the last name field
    this.getEmail().type('john');
    this.getEmail().clear(); //clear the email field
    this.getUserTypeAdmin();
    this.getPassword().type('Password@123');
    this.getPassword().clear(); //clear the password field
    this.getConfirmPassword().type('Pass');
    this.getConfirmPassword().clear(); //clear the confirm password field
    this.getSkillID();
    //this.submitAddTeamButton();
    //this.submitAddTeamButton().click({force: true});
  }
  validateFieldWithEmptySpaces() {
    const mail = this.generateRandomEmail();
    this.visitTeamPage().click();
    this.getAddTeamButton().click();
    this.getFirstName().type('    ');
    this.getLastName().type('   ');
    this.getEmail().type('   ');
    this.getEmail().clear(); //clear the email field
    this.getUserTypeAdmin();
    this.getPassword().type('   ');
    this.getConfirmPassword().type('   ');
    this.getSkillID('   ');
    //this.submitAddTeamButton();
    //this.submitAddTeamButton().click({force: true});
  }
}

module.exports = AddTeam;
