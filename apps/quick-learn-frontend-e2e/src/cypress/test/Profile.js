class profile {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
  }
  // visitTeamPage() {
  //   return cy.get('[href="/dashboard/teams"]');
  // }

  // userMenu() {
  //   return cy.contains('Open user menu');
  // }
  getMyProfile() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/profile-settings"]').click();
    //cy.contains('My Profile');
  }
  // OpenProfile() {
  // //this.userMenu().click();
  // this.getMyProfile().click();
  //  }

  uploadPic() {
    // cy.wait(5000);
    cy.contains('Upload avatar').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/superAdmin.jpg', {
      force: true,
    });
    // cy.get('.flex-wrap > .false').click();

    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  UpdateFirstName() {
    cy.contains('First Name').should('be.visible');
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('SuperA');
    cy.get('[type="submit"]').click();
    // cy.get('.flex-wrap > .false').click();
  }
  UpdateLastName() {
    // cy.get(
    //   ':nth-child(3) > .relative > #profileSettingsForm_input_text',
    // ).clear();
    // cy.get(':nth-child(3) > .relative > #profileSettingsForm_input_text').type(
    //   'Gupta',
    // );
    cy.contains('Last Name').should('be.visible');
    cy.get('[name="last_name"]').clear();
    cy.get('[name="last_name"]').type('Admin');
    cy.get('[type="submit"]').click();
    // cy.get('.flex-wrap > .false').click();
    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }
  UpdateFirstNameWithEmptySpaces() {
    cy.contains('First Name');
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('    ');
    cy.get('.mt-1').should('contain', 'First name is required');
  }
}
//}

module.exports = profile;
