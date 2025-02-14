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
    return cy.get('.Toastify');
  }

  getWelcomeMessage() {
    cy.get('.Toastify__toast-body')
      .contains('Successfully logged in.')
      .should('be.visible');
  }

  login(mail, password) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(mail);
    this.getPasswordInput().type(password);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
  }
  loginWithInvalidCredential(username, password) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(username);
    this.getPasswordInput().type(password);
    this.clickRememberMeCheckbox(); // Check after filling credentials
    this.getSubmitButton().click();
  }
  loginWithEmptyValue() {
    this.getUsernameInput().clear();
    this.getPasswordInput().clear();
    this.getSubmitButton().should('be.disabled');
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

  loginAsAdmin(AdminMail, AdminPassword) {
    this.ensureRememberMeUnchecked(); // Uncheck before filling credentials
    this.getUsernameInput().type(AdminMail);
    this.getPasswordInput().type(AdminPassword);
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
