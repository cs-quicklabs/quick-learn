class addRoadMap{
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
       openRoadMap()
       {
        return cy.contains("").click()
       }
    }
    module.exports = addRoadMap