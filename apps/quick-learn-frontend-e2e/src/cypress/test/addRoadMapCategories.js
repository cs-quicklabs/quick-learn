class addRoadMap{
    visitTeamPage(){
        return cy.get('[href="/dashboard/teams"]')
       }

       userMenu(){
       return cy.contains('Open user menu')
       }
       getAccountSettings(){
           return cy.contains("Account Settings")
       }
       openRoadMap()
       {
        return cy.contains("Roadmap Categories").click()
       }

       clickRoadmapField()
       {
        return cy.get('#roadmap_categories_input_text').click()
       }
       addRoadMapCategories()
       {
        const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
        return cy.get('#roadmap_categories_input_text').type('ReactJs'+Numeric)
       }
       
       OpenAccountSettings()
       {
        this.userMenu().click()
        this.getAccountSettings().click()

       }
       getErrorMessage() {
        return cy.get('.mt-1')
      }
      addRoadmapCategoriesWithOnlySpaces()
      {
       
       return cy.get('#roadmap_categories_input_text').type('    ')
      }
      addRoadmapCategoriesWithMoreLimit()
      {
        return cy.get('#roadmap_categories_input_text').type('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.')

      }

       saveButton()
       {
        return cy.get('.space-y-4 > .false').click()
       }
    }
    module.exports = addRoadMap