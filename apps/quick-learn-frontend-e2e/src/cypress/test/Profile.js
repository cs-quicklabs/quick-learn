class profile{
    visitTeamPage(){
        return cy.get('[href="/dashboard/teams"]')
       }

       userMenu(){
       return cy.contains('Open user menu')
       }
       getMyProfile(){
           return cy.contains("My Profile")
       }
       OpenProfile()
       {
        this.userMenu().click()
        this.getMyProfile().click()

       }
       uploadPic()
       {
        cy.wait(5000)
        cy.get('.mt-2 > .relative > .absolute').click()

cy.get('input[type="file"]').selectFile('cypress/fixtures/drdoom.jpg', { force: true });

cy.get('.Toastify').should('contain','File upload successfully')
       }
    }
    module.exports=profile