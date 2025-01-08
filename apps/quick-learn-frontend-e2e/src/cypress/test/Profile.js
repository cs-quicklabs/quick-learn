class profile {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
  }
  getMyProfile() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/profile-settings"]').click();
  }

  uploadPic() {
    cy.contains('Upload avatar').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/superAdmin.jpg', {
      force: true,
    });

    cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }

  UpdateFirstName() {
    const randomName = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
    console.log(randomName.charAt(0).toUpperCase() + randomName.slice(1));
        cy.contains('First Name').should('be.visible');
        cy.get('#profileSettingsForm_input_text').clear();
        cy.get('#profileSettingsForm_input_text').type('Super' + randomName);
        cy.get('[type="submit"]').click();
  }
  UpdateLastName() {
    const randomName = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('');
    console.log(randomName.charAt(0).toUpperCase() + randomName.slice(1));
        cy.contains('Last Name').should('be.visible');
        cy.get('[name="last_name"]').clear();
        cy.get('[name="last_name"]').type('Admin' + randomName);
        cy.get('[type="submit"]').click();
        cy.get('.Toastify').should('contain', 'Profile updated successfully');
  }
  UpdateFirstNameWithEmptySpaces() {
    cy.contains('First Name');
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('    ');
    cy.get('.mt-1').should('contain', 'First name is required');
  }
}

module.exports = profile;
