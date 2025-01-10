export class UpdateGeneralSettings {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
  }
  getAccountSettings() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
  }
  uploadLogo() {
    this.getAccountSettings();
    cy.contains('Upload Team Logo').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.contains("Yes, I'm sure").should('be.visible');
    cy.get('button.text-white.bg-red-600').click();
    cy.contains('Successfully updated team details.').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/Team.jpg', {
      force: true,
    });
    cy.get('[type="submit"]').click();
    cy.get('body > div.Toastify > div').should(
      'contain',
      'Successfully updated team details.',
    );
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
    this.getAccountSettings();
  }

  editSettings() {
    this.getAccountSettings();
    const randomName = Array.from({ length: 2 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join('');
    console.log(randomName.charAt(0).toUpperCase() + randomName.slice(1));
    cy.contains('Team Name').should('be.visible');
    this.editTeamName().clear();
    this.editTeamName().type('Team CS ' + randomName);
    this.saveButton().click();
  }
  editTeamNameWithOnlySpaces() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('   ');
    this.getError().contains('This field is mandatory');
  }
}
