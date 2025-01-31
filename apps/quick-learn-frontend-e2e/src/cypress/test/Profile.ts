export class Profile {
  visitProfilePage() {
    return cy.get('[id="headerProfileImage"]').click();
  }
  // getMyProfile() {
  //   cy.get('[id="headerProfileImage"]').click();
  //   cy.get('[href="/dashboard/profile-settings"]').click();
  // }

  getMyProfile() {
    cy.get('body').then(($body) => {
      if ($body.length > 0) {
        cy.get('[id="headlessui-menu-button-:r5:"]')
          .click();
          cy.contains("My Profile").should('be.visible');
          cy.get('[href="/dashboard/profile-settings"]').click();
          
      } else {
        cy.get('[id="headerProfileImage"]')
          .click();
          cy.contains("My Profile").should('be.visible');
          cy.get('[href="/dashboard/profile-settings"]').click();
      }
    });
  }

  uploadPic() {
    
    cy.contains('Upload avatar').should('be.visible');
    cy.get('.mt-2 > .relative > .absolute').then(($logo) => {
        if ($logo.length > 0) {
            // If no logo is found, upload a new one
            cy.log('No logo found, uploading...');
            cy.get('.mt-2 > .relative > .absolute').click();
            cy.get('input[type="file"]').selectFile('cypress/fixtures/superAdmin.jpg', {
              force: true,
            });

            
            cy.get('.Toastify').should('contain', 'Profile updated successfully');
        } else {
            // If logo exists, delete it first then upload
            cy.log('Logo found, deleting first...');
            cy.get('.mt-2 > .relative > .absolute').click();
            cy.contains("Yes, I'm sure").should('be.visible');
            cy.get('button.text-white.bg-red-600').click();
            cy.get('.Toastify').should('contain', 'Profile updated successfully');

            // Upload new logo after deletion
            cy.log('Uploading new logo...');
            cy.get('.mt-2 > .relative > .absolute').click();
            cy.get('input[type="file"]').selectFile('cypress/fixtures/Team.jpg', { force: true });

            
            cy.get('.Toastify').should('contain', 'Profile updated successfully');
        }
    });
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
  UpdateLastNameWithEmptySpaces(){
    cy.contains('Last Name');
    cy.get('[name="last_name"]').clear();
    cy.get('[name="last_name"]').type('    ');
    cy.get('.mt-1').should('contain', 'Last name is required');
  }
}
