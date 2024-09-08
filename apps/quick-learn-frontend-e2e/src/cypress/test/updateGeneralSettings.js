class updateGeneralSettings{
    visitTeamPage(){
        return cy.get('[href="/dashboard/teams"]')
       }

       userMenu(){
       return cy.contains('Open user menu')
       }
       getAccountSettings(){
           return cy.contains("Account Settings")
       }
       editTeamName()
       {
        return cy.get('#accountSettingsForm_input_text')
       }
       getError()
       {
        return cy.get('.mt-1')
       }
       saveButton()
       {
        return cy.get('.space-y-4 > .false')
       }

       OpenAccountSettings()
       {
        this.userMenu().click()
        this.getAccountSettings().click()

       }

       editSettings()
       {
        this.userMenu().click()
        this.getAccountSettings().click()
        this.editTeamName().clear()
        this.editTeamName().type("crownstack")
        this.saveButton().click()
       }
       editTeamNameWithOnlySpaces()
       {
        this.userMenu().click()
        this.getAccountSettings().click()
        this.editTeamName().clear()
        this.editTeamName().type("   ")
        this.getError().contains("This field is mandatory and cannot contain only whitespace")
       }

}
module.exports = updateGeneralSettings