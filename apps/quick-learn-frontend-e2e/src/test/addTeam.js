
class AddTeam {
  visitTeamPage(){
   return cy.get('[href="/dashboard/teams"]')
  }

  getAddTeamButton(){
    return cy.get('.flex > .px-4')
    }

    getFirstName()
    {
        return cy.get('#first_name')
    }
    getLastName(){
        return cy.get('#last_name')
    }
    getEmail()
    {
        return cy.get('#email')
    }
    getUserTypeAdmin()
    {
       return cy.get('#user_type_id').select("Admin")
       
    }
    getUserTypeEditor()
    {
       return cy.get('#user_type_id').select("Admin")
       
    }
    getUserTypeMember()
    {
       return cy.get('#user_type_id').select("Admin")
       
    }
   
    

    getPassword()
    {
        return cy.get('#password')
    }
    getConfirmPassword()
    {
        return cy.get('#confirm_password')
    }

    getSkillID()
    {
        return cy.get('#skill_id').select("Testing 007");
      
    }
    
    submitAddTeamButton()
    {
        return cy.get('.py-2\.5').click()
    }

    addTeam(){
        this.visitTeamPage().click();
        this.getAddTeamButton().click()
        this.getFirstName().type("Raj")
        this.getLastName().type("Gupta")
        this.getEmail().type("Raj@yopmail.com")
        this.getUserTypeAdmin()
        this.getPassword().type("Password@123")
        this.getConfirmPassword().type("Password@123")
        this.getSkillID()
        this.submitAddTeamButton()
    
       
    
      }
    
}

  
  module.exports = AddTeam;