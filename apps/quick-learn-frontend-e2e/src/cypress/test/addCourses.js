class addCourses{
    visitTeamPage(){
        return cy.get('[href="/dashboard/teams"]')
       }

       userMenu(){
        cy.wait(10000)
       return cy.contains('Open user menu')
       }
       getAccountSettings(){
           return cy.contains("Account Settings")
       }
       openCourses()
       {
        return cy.contains("Courses Categories").click()
       }
       clickCourses()
       {
        return cy.get('#courses_categories_input_text')
       }
       addCourses()
       {
        const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
        return cy.get('#courses_categories_input_text').type('ReactJs'+Numeric)
       }
       addCoursesWithOnlySpaces()
       {
        
        return cy.get('#courses_categories_input_text').type('    ')
       }
       addCoursesWithMoreLimit()
       {
        return cy.get('#courses_categories_input_text').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.')  
       }



       saveButton()
       {
        return cy.get('.space-y-4 > .false').click()
       }
       getErrorMessage() {
        return cy.get('.mt-1')
      }

       OpenAccountSettings()
       {
        this.userMenu().click()
        this.getAccountSettings().click()

       }

      

}
module.exports = addCourses