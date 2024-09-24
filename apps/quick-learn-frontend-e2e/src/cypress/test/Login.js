
class LoginPage {
    visit() {
      cy.visit('/'); // Replace with your login page URL
    }
  
    getUsernameInput() {
      return cy.get('#loginForm_input_text')
    }
  
    getPasswordInput() {
      return cy.get('#loginForm_input_passwordpassword')
    }
  
    getSubmitButton() {
      return cy.get('button[type="submit"]');
    }
  
    getErrorMessage() {
      return cy.get('.Toastify')
    }
  
    getWelcomeMessage() {
      return cy.get('.Toastify');
    }
  
    login() {
      let username="super.admin@yopmail.com"
      let password="password@123P"
      this.getUsernameInput().type(username);
      this.getPasswordInput().type(password);
      this.getSubmitButton().click();
    }

    loginWithInvalidCredential(username,password) {
      this.getUsernameInput().type(username);
      this.getPasswordInput().type(password);
      this.getSubmitButton().click();
    }
    loginWithEmptyValue() {
      this.getSubmitButton().should('be.disabled');
    }

  }
  
  module.exports = LoginPage;