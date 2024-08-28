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

       saveButton()
       {
        return cy.get('.space-y-4 > .false').click()
       }
     

       OpenAccountSettings()
       {
        this.userMenu().click()
        this.getAccountSettings().click()

       }

      

}
module.exports = addCourses