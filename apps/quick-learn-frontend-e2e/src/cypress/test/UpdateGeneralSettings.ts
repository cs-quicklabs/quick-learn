export class UpdateGeneralSettings {
  visitAccountsPage() {
    return cy.get('button.flex.items-center').click();
  }
  getAccountSettings() {
    cy.get('button.flex.items-center').click();
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
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
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
  getSuccessMessage() {
    cy.get('div.Toastify__toast-container').should(
      'contain',
      'Successfully updated team details.',
    );
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
    this.saveButton();
    this.getSuccessMessage();
  }
  editTeamNameWithOnlySpaces() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('   ');
    this.getError().contains('This field is mandatory');
  }

  editTeamNameWithOnlyNumbers() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('1234556');
    this.saveButton();
    this.getSuccessMessage();
  }

  editTeamNameWithIncorrectData() {
    this.getAccountSettings();
    this.editTeamName().clear();
    this.editTeamName().type('#@#@#');
    this.getError().contains('Only alphabets, digits and space are allowed');
  }
  uploadPicWithMoreMB() {
    this.getAccountSettings();
    cy.contains('Upload Team Logo').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('button.text-white.bg-red-600').contains("Yes, I'm sure").click();
    cy.get('div.Toastify__toast--success').should(
      'contain',
      'Successfully updated team details.',
    );
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/MoreMB.jpeg', {
      force: true,
    });
    cy.get('p.mt-1').should('contain', 'File should be less than 1MB.');
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/Team.jpg', {
      force: true,
    });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  }
}
