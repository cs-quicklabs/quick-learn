export class LoginPage {
  visit() {
    cy.visit('/');
  }

  getUsernameInput() {
    return cy.get('#loginForm_input_text');
  }

  getPasswordInput() {
    return cy.get('#loginForm_input_passwordpassword');
  }
  ensureRememberMeUnchecked() {
    cy.get('input[type="checkbox"]').then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).uncheck(); // Ensure it is unchecked initially
      }
    });
  }
  clickRememberMeCheckbox() {
    cy.get('input[type="checkbox"]').check(); // Check after entering credentials
  }
  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  getErrorMessage() {
    return cy.get('div.Toastify__toast');
  }

  getError() {
    return cy.get('p.mt-1');
  }

  getWelcomeMessage() {
    cy.get('div.Toastify__toast--success')
      .contains('Successfully logged in.')
      .should('be.visible');
  }

  login(mail, password) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(mail);
    this.getPasswordInput().type(password);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
    this.getWelcomeMessage();
  }
  loginWithInvalidCredential(username, password) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(username);
    this.getPasswordInput().type(password);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
  }
  loginWithEmptyValue() {
    this.getUsernameInput().type(' ');
    this.getError().should('contain', 'This field is required');
    this.getPasswordInput().type(' ');
    this.getError().should(
      'contain',
      'Password must be at least 8 characters long',
    );
    this.getSubmitButton().should('be.disabled');
  }

  loginWithIncorrectData() {
    this.ensureRememberMeUnchecked();
    this.getUsernameInput().type('super.yo@');
    this.getError().should('contain', 'Invalid email address');
    this.getPasswordInput().type('Pass');
    this.getError().should(
      'contain',
      'Password must be at least 8 characters long',
    );
    this.getUsernameInput().clear();
    this.getUsernameInput().type('test1.21@yopmail.com');
    this.getPasswordInput().clear();
    this.getPasswordInput().type('password@123P');
    this.clickRememberMeCheckbox();
    this.getSubmitButton().click();
    this.getErrorMessage().should(
      'contain',
      'No user is linked to the provided email.',
    );
  }

  loginAsEditor(EditorMail, EditorPassword) {
    cy.get('.text-xl').contains('Sign in to your account');
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(EditorMail);
    this.getPasswordInput().type(EditorPassword);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
    this.getWelcomeMessage();
  }

  loginAsAdmin(Admin1Mail, Admin1Password) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(Admin1Mail);
    this.getPasswordInput().type(Admin1Password);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
    this.getWelcomeMessage();
  }

  loginAsMember(MemberMail, MemberPassword) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(MemberMail);
    this.getPasswordInput().type(MemberPassword);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
    this.getWelcomeMessage();
  }
}
