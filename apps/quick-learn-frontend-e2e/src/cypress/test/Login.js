class LoginPage {
  // visit() {
  //   cy.visit("http://dev.learn.build-release.com/");
  // }
  visit() {
    cy.visit('/');
  }
  // visit(){
  //   cy.login().then(function ()
  //   {
  //     cy.visit("http://dev.learn.build-release.com/",{
  //       onBeforeLoad :function(window)
  //       {
  //         window.localStorage.setItem('token',Cypress.env('token'));
  //         }
  //       })
  //     }
  //   )
  // }

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
    return cy.get('.Toastify');
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
}

module.exports = LoginPage;
