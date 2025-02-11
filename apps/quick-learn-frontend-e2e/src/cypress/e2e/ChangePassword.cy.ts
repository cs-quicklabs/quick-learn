import { LoginPage } from '../test/Login';
import { ChangePassword } from '../test/ChangePassword';
import { AdminValidCredentials } from '../fixtures/credential';

describe('Change Password', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(
      AdminValidCredentials.AdminMail,
      AdminValidCredentials.AdminPassword,
    );

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });

  it('Verify User not able to update password when old and new passwords are duplicate', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.UpdatePasswordWithSameOldAndNewPassword();
  });

  it('Verify user not able to update password when New and Confirm password mismatch', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.UpdatePasswordWithDifferentNewAndConfirmPassword();
  });

  it('Verify user not able to update password when length is small', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.UpdatePasswordWithLesserLength();
  });

  it('Verify user not able to update password when password is lengthy', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.UpdatePasswordWithLimitExceed();
  });

  it('Verify User should not able to update password with invalid data', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.SetInvalidPassword();
  });

  it('Verify User should able to Update Password with valid data ', () => {
    const changePassword = new ChangePassword();
    changePassword.getChangePassword();
    changePassword.UpdatePasswordWithValidData();
  });
});
