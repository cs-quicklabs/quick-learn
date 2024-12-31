class Profile {
  visitTeamPage() {
    return cy.get('[href="/dashboard/teams"]');
  }

  userMenu() {
    return cy.contains('Open user menu');
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
    cy.get('.flex-wrap > .false').click();
    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  UpdateFirstName() {
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('Divanshu');
    cy.get('.flex-wrap > .false').click();
  }

  UpdateLastName() {
    cy.get(
      ':nth-child(3) > .relative > #profileSettingsForm_input_text',
    ).clear();
    cy.get(':nth-child(3) > .relative > #profileSettingsForm_input_text').type(
      'Gupta',
    );
    cy.get('.flex-wrap > .false').click();
    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  UpdateFirstNameWithEmptySpaces() {
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('    ');
    cy.get('.mt-1').should('contain', 'First name is required');
  }
}

module.exports = Profile;
