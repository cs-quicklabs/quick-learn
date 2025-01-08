class updateGeneralSettings {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
  }
  getAccountSettings() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
  }
  editTeamName() {
    return cy.get('#accountSettingsForm_input_text');
  }
  getError() {
    return cy.get('.mt-1');
  }
  saveButton() {
    return cy.get('[type="submit"]').click();
  }

  OpenAccountSettings() {
    this.getAccountSettings().click();
  }

  editSettings() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('crownstack pvt');
    this.saveButton().click();
  }
  editTeamNameWithOnlySpaces() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('   ');
    this.getError().contains('This field is mandatory');
  }
}

module.exports = updateGeneralSettings;
