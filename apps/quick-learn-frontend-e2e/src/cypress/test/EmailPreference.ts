export class EmailPreference {
  visitProfilePage() {
    return cy.get('button.flex.items-center').click();
  }
  getEmailPreferenceButton() {
    cy.get('button.flex.items-center').click();
    cy.get('[href="/dashboard/profile-settings"]').click();
    cy.get('[href="/dashboard/profile-settings/email-preference"]').click();
  }

  ensureEmailAlertChecked() {
    cy.get('input[type="checkbox"]').then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).check(); // Ensure it is checked initially
      }
    });
  }
  UncheckEmailAlertCheckbox() {
    cy.get('input[type="checkbox"]').uncheck(); // UnCheck Email Alert
  }

  CheckEmailAlertCheckbox() {
    cy.get('input[type="checkbox"]').check(); // Check Email Alert
  }

  getSuccessMessage() {
    cy.get('div.Toastify__toast').should(
      'contain',
      'Email preference updated successfully.',
    );
  }

  EnableEmailAlert() {
    this.getEmailPreferenceButton();
    cy.get('h1.text-lg').contains('Preference').should('be.visible');
    this.CheckEmailAlertCheckbox();
    this.getSuccessMessage();
  }

  DisableEmailAlert() {
    this.getEmailPreferenceButton();
    cy.get('h1.text-lg').contains('Preference').should('be.visible');
    this.ensureEmailAlertChecked();
    this.UncheckEmailAlertCheckbox();
    this.getSuccessMessage();
  }
}
