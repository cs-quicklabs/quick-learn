export class Profile {
  visitProfilePage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  getMyProfile() {
    cy.get('[id="headerProfileImage"]').click();
    cy.get('[href="/dashboard/profile-settings"]').click();
  }

  uploadPic() {
    cy.contains('Upload avatar').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/superAdmin.jpg', {
      force: true,
    });

    cy.get('div.Toastify__toast').should(
      'contain',
      'Profile updated successfully',
    );
  }

  uploadPicWithMoreMB() {
    cy.contains('Upload avatar').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('button.text-white.bg-red-600').contains("Yes, I'm sure").click();
    cy.get('div.Toastify__toast--success').should(
      'contain',
      'Profile updated successfully',
    );
    cy.get('.mt-2 > .relative > .absolute').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/MoreMB.jpeg', {
      force: true,
    });
    cy.get('p.mt-1').should('contain', 'File should be less than 1MB.');
  }

  UpdateFirstName() {
    const randomName = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join('');
    console.log(randomName.charAt(0).toUpperCase() + randomName.slice(1));
    cy.contains('First Name').should('be.visible');
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('Super' + randomName);
    cy.get('[type="submit"]').click();
  }
  UpdateLastName() {
    const randomName = Array.from({ length: 3 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
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

  UpdateLastNameWithEmptySpaces() {
    cy.contains('Last Name');
    cy.get('[name="last_name"]').clear();
    cy.get('[name="last_name"]').type('    ');
    cy.get('.mt-1').should('contain', 'Last name is required');
  }

  UpdateNameFieldWithIncorrectData() {
    cy.get('#profileSettingsForm_input_text').type('122112');
    cy.get('p.mt-1').should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    cy.get('[name="last_name"]').type('123425');
    cy.get('p.mt-1').should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    cy.get('#profileSettingsForm_input_text').clear();
    cy.get('#profileSettingsForm_input_text').type('@@#$@');
    cy.get('p.mt-1').should(
      'contain',
      'First name should only contain alphabetic characters',
    );
    cy.get('[name="last_name"]').clear();
    cy.get('[name="last_name"]').type('@@@#@@@');
    cy.get('p.mt-1').should(
      'contain',
      'Last name should only contain alphabetic characters',
    );
    cy.get('[type="submit"]').should('be.disabled');
  }

  EmailFieldDisabled() {
    cy.get('[name="email"]').should('be.disabled');
  }
}
