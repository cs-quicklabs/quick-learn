class Profile {
  visitTeamPage() {
    return cy.get('[href="/dashboard/teams"]');
  }

  userMenu() {
    return cy.get('button[id^="headlessui-menu-button"]');
  }

  getMyProfile() {
    return cy.contains('My Profile');
  }

  OpenProfile() {
    this.userMenu().click();
    this.getMyProfile().click();
  }

  uploadPic() {
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/drdoom.jpg', {
      force: true,
    });
    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  deleteProfilePic() {
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('img[alt="Profile"]').should('be.visible').click({ force: true });
    cy.get('button[type="button"]').contains("Yes, I'm sure").click();
    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  UpdateFirstName() {
    const locator = 'input[type="text"][name="first_name"]';
    cy.get(locator).clear();
    cy.get(locator).type(
      'Divanshu' + String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    );
    cy.get('button[type="submit"]').click();
  }

  UpdateLastName() {
    const locator = 'input[type="text"][name="last_name"]';
    cy.get(locator).clear();
    cy.get(locator).type(
      'Gupta' + String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    );
    cy.get('button[type="submit"]').click();
  }

  UpdateFirstNameWithEmptySpaces() {
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('    ');
    cy.get('.mt-1').should('contain', 'First name is required');
  }
}

module.exports = Profile;
