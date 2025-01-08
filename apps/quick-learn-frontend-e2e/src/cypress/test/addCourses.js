class addCourses {
  visitProfilePage() {
    return cy.get('button[class="flex items-center"]').click();
  }
  getAccountSettings() {
    cy.get('button[class="flex items-center"]').click();
    cy.get('[href="/dashboard/account-settings"]').click();
  }
  openCourses() {
    return cy.contains('Courses Categories').click();
  }
  clickCourses() {
    return cy.get('#courses_categories_input_text');
  }
  addCourses() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#courses_categories_input_text').type('ReactJs' + Numeric);
  }
  addCoursesWithOnlySpaces() {
    return cy.get('#courses_categories_input_text').type('    ');
  }
  addCoursesWithMoreLimit() {
    return cy
      .get('#courses_categories_input_text')
      .type(
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      );
  }

  saveButton() {
    return cy.get('.flex-wrap > .false').click();
  }
  getErrorMessage() {
    return cy.get('.mt-1');
  }

  editCourseCategories() {
    const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#courses_categories_name_edit').clear();
    cy.get('#courses_categories_name_edit').type('React' + Numeric);
    cy.get('.ml-5').click();
  }
  editCourseCategoriesWithEmptySpaces() {
    cy.get(':nth-child(1) > .inline-flex > .text-blue-600').click();
    cy.get('#courses_categories_name_edit').clear();
    cy.get('#courses_categories_name_edit').type('    ');
    cy.get('.ml-5').click();
    cy.get('td > .px-2').should('contain', 'This field is mandatory');
  }

  deleteCourseCategories() {
    cy.get(':nth-child(3) > .inline-flex > .ml-2').click();
  }

  deleteCourseCategoriesAssociatedWithCourses() {
    cy.get(':nth-child(13) > .inline-flex > .ml-2').click();
    cy.get('[class="flex-1 overflow-auto p-0"]');
    cy.get('button.bg-white.uppercase').click();
  }

  OpenAccountSettings() {
    this.getAccountSettings();
  }
}
module.exports = addCourses;
