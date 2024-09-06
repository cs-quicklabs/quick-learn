class addPrimarySkill{
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
       openPrimarySkill()
       {
        return cy.contains("Primary Skills").click()
       }
       clickSkillField()
       {
        return cy.get('#primary_skills_input_text').click()
       }
       addPrimarySkill()
       {
        const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
        return cy.get('#primary_skills_input_text').type('ReactJs'+Numeric)
       }

       addPrimarySkillWithOnlySpaces()
       {
        return cy.get('#primary_skills_input_text').type('   ')
       }

       addPrimarySkillWithMoreCharacters()
       {
        return cy.get('#primary_skills_input_text').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.')
       }
       getErrorMessage() {
        return cy.get('.mt-1')
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
module.exports = addPrimarySkill