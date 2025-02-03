export class UpdateGeneralSettings {
  visitAccountsPage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getAccountSettings() {
    cy.get('body').then(($body) => {
      if ($body.length > 0) {
        cy.get('[id="headlessui-menu-button-:r5:"]').click();
        cy.contains('Account Settings').should('be.visible');
        cy.get('[href="/dashboard/account-settings"]').click();
      } else {
        cy.get('[id="headerProfileImage"]').click();
        cy.contains('Account Settings').should('be.visible');
        cy.get('[href="/dashboard/account-settings"]').click();
      }
    });
  }

  uploadLogo() {
    this.getAccountSettings();
    cy.contains('Upload Team Logo').should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.length > 0) {
        // If no logo is found, upload a new one
        cy.log('No logo found, uploading...');
        cy.get('.mt-2 > .relative > .absolute').should('not.exist');
        cy.get('.mt-2 > .relative > .absolute').click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/Team.jpg', {
          force: true,
        });

        cy.get('body > div.Toastify > div').should(
          'contain',
          'Successfully updated team details.',
        );
      } else if ($body.length === 0) {
        // If logo exists, delete it first then upload
        cy.log('Logo found, deleting first...');

        cy.get('.mt-2 > .relative > .absolute').click();
        // cy.contains("Yes, I'm sure").should('be.visible');
        cy.get('button.text-white.bg-red-600')
          .contains("Yes, I'm sure")
          .click();
        cy.contains('Successfully updated team details.').should('be.visible');

        // Upload new logo after deletion
        cy.log('Uploading new logo...');
        cy.get('.mt-2 > .relative > .absolute').click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/drdoom.jpg', {
          force: true,
        });

        cy.get('body > div.Toastify > div').should(
          'contain',
          'Successfully updated team details.',
        );
      }
    });
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
