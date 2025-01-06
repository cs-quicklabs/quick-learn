class updateGeneralSettings {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
      }
  // visitTeamPage() {
  //   return cy.get('[href="/dashboard/teams"]');
  // }

  // userMenu() {
  //   return cy.contains('Open user menu');
  // }
  getAccountSettings() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
    //return cy.contains('Account Settings');
  }
  editTeamName() {
    cy.wait(6000)
    return cy.get('#accountSettingsForm_input_text')
  }
  getError() {
    return cy.get('.mt-1');
  }
  saveButton() {
    //return cy.get('.flex-wrap > .false').click();
    return cy.get('[type="submit"]').click();
  }

  OpenAccountSettings() {
    // this.userMenu().click();
    this.getAccountSettings().click();
  }

  editSettings() {
    // this.userMenu().click();
    //this.getAccountSettings().click();
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('crownstack pvt');
    this.saveButton().click();
  }
  editTeamNameWithOnlySpaces() {
    // this.userMenu().click();
    //this.getAccountSettings().click();
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('   ');
    this.getError().contains('This field is mandatory');
  }

  uploadLogo() {
  //   // this.userMenu().click();
  // this.getAccountSettings().click();
  this.getAccountSettings();
  cy.wait(2000);
  cy.get('.mt-2 > .relative > .absolute').click();
  cy.wait(2000);
  cy.get('[type="button"]').eq(4).click();
  cy.wait(2000);
  cy.get('input[type="file"]').selectFile('cypress/fixtures/Team.jpg', {
    force: true,
  });
  cy.wait(2000);
  cy.get('[type="submit"]').click();

   }
}
module.exports = updateGeneralSettings;
