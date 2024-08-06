
class LoginPage {
    visit() {
      cy.visit('/'); // Replace with your login page URL
    }
  
    getUsernameInput() {
      return cy.get('#email')
    }
  
    getPasswordInput() {
      return cy.get('#password')
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
  
    login(username, password) {
      this.getUsernameInput().type(username);
      this.getPasswordInput().type(password);
      this.getSubmitButton().click();
    }
  }
  
  module.exports = LoginPage;