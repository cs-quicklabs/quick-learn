export class ChangePassword {
    visitProfilePage() {
      return cy.get('button[class="flex items-center"]').click();
    }
    getChangePassword() {
      cy.get('button[class="flex items-center"]').click();
      cy.get('[href="/dashboard/profile-settings"]').click();
      cy.get('[href="/dashboard/profile-settings/change-password"]').click();
    }
    getOldPassword(){
        return cy.get('#changePasswordForm_input_passwordoldPassword');
    }
    getNewPassword(){
        return cy.get('#changePasswordForm_input_passwordnewPassword');
    }
    getConfirmPassword(){
        return cy.get('#changePasswordForm_input_passwordconfirmPassword');
    }
    getSaveButton(){
        return cy.get('[type="submit"]');
    }
    getErrorMessage() {
        return cy.get('.mt-1');
      }
      getSuccessMessage(){
        return cy.get('.Toastify__toast-container');
      }
    UpdatePasswordWithValidData (){
        cy.contains('Change Password').should('be.visible');
        this.getOldPassword().type('password@123P');
        this.getNewPassword().type('password@123PA');
        this.getConfirmPassword().type('password@123P');
        this.getSaveButton().click();
        this.getSuccessMessage().contains('Password updated successfully.');
    }
    UpdatePasswordWithSameOldAndNewPassword(){
        cy.contains('Please change your password.').should('be.visible');
        this.getOldPassword().type('password@123P');
        this.getNewPassword().type('password@123P');
        this.getConfirmPassword().type('password@123P');
        this.getSaveButton().click();
        this.getErrorMessage().contains("Current and new passwords cannot be the same.");
    }
    UpdatePasswordWithDifferentNewAndConfirmPassword(){
        cy.contains('Please change your password.').should('be.visible');
        this.getOldPassword().type('password@123P');
        this.getNewPassword().type('Password@923P');
        this.getConfirmPassword().type('password@123P');
        this.getSaveButton().click();
        this.getErrorMessage().contains("Password don't match");
    }
    UpdatePasswordWithLesserLength(){
        cy.contains('Please change your password.').should('be.visible');
        this.getOldPassword().type('password@123P');
        this.getNewPassword().type('Pass');
        this.getConfirmPassword().type('Pass');
        this.getSaveButton().click();
        this.getErrorMessage().contains("Password should be at least 8 chars long");
    }
    UpdatePasswordWithMoreLimit(){
        cy.contains('Please change your password.').should('be.visible');
        this.getOldPassword().type('password@123P');
        this.getNewPassword().type('Pass');
        this.getConfirmPassword().type('Pass');
        this.getSaveButton().click();
        this.getErrorMessage().contains("Password should be 8 chars long");
    }
}