export class CreateNewRoadMap{
    visitContentPage(){
        return cy.get('[href="/dashboard/content"]').click();
    }
    getCreateNewRoadMap(){
        cy.contains("Create New Roadmap").should('be.visible');
        cy.get('section div button').click();
    }

    EnterRoadMapName(){
        const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#addRoadmapForm_input_text').type('RoadMap ' + Numeric);
    }
    
    SelectRoadMapCategory(){
        cy.contains("Roadmap Category").should('be.visible');
        cy.get('#addRoadmapForm_select_roadmap_category_id').select(6);
    }
    AddDescription(){
        const Numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return cy.get('#addRoadmapForm_textarea_description').type('RoadMap Description ' + Numeric);
    }

    BlankRoadMapName(){
     cy.get('#addRoadmapForm_input_text').type('   ');
     cy.get('.mt-1').eq(0).contains("This field is mandatory");
    }

    BlankRoadmapDescription(){
    cy.get('#addRoadmapForm_textarea_description').type('   ');
    cy.get('.mt-1').eq(1).contains("This field is mandatory");
    }

    RoadmapNameWithExcessCharacters(){
        cy.get('#addRoadmapForm_input_text').type('After 50 characters the limit exceeded message will be shown.');
        cy.get('.mt-1').eq(0).contains("The value should not exceed 50 characters.") 
    }

    RoadmapDescriptionWithExcessCharacters(){
        cy.get('#addRoadmapForm_textarea_description').type('The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test  The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test The description limit is set to 5000 characters. So we will test it with Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test Lorem ipsum test lorem ipsum test lorem ipsum test lorem ipsum test');
        cy.get('.mt-1').eq(1).contains("The value should not exceed 5000 characters."); 
    }

    getRoadMapsList(){
    cy.get('.text-2xl').contains("All Roadmaps");
    cy.get('section div a').each(($el, index) => {
    cy.log(`Index: ${index}, Text: ${$el.text()}`);
    });
    cy.get('section div a').eq(4).click();
}

// getRoadMapListToEdit(){
//         cy.get('.text-2xl').contains("All Roadmaps");
//         cy.get('section div a').each(($el, index) => {
//         cy.log(`Index: ${index}, Text: ${$el.text()}`);
//         });
//         cy.get('section div a').eq(1).click();
//     }

UpdateRoadMapCategory(){
    cy.contains("Roadmap Category").should('be.visible');
    cy.get('#addRoadmapForm_select_roadmap_category_id').select(7);
}
   getEditRoadmapbutton(){
    cy.get('p.text-sm').contains("created this roadmap on");
    cy.get('button.text-black').eq(0).click();
    cy.get('.text-lg').contains("Edit Roadmap");
    }

    getSubmitButton(){
        return cy.get('[type="submit"]').click();
    }


    getCancelButton(){
        cy.get('button[type="button"]').contains("Cancel").click();
    }

    getSuccessMessage(){
        return cy.get('.Toastify__toast-body').contains("Roadmap created Successfully.").should('be.visible');
    }

    getEditSuccessMessage(){
        return cy.get('.Toastify__toast-body').contains("Roadmap updated successfully.").should('be.visible');
    }

    getAddExistingCoursesButton(){
        cy.get('p.text-sm').contains("created this roadmap on");
        cy.get('button.text-black').eq(1).click();
        cy.get('.text-xl').contains("Add existing Courses");
    }

    getExistingCoursesList(){
        cy.get('[id="brand-tab"]').contains("Select Courses");
        cy.get('[data-testid="flowbite-accordion-heading"]').each(($el, index) => {
            cy.log(`Index: ${index}, Text: ${$el.text()}`);
          });
          cy.get('[data-testid="flowbite-accordion-heading"]').eq(3).click();
    }

    EnsureExistingCoursesUnchecked() {
        cy.get('[type="checkbox"]').eq(5).then(($checkbox) => {
          if ($checkbox.is(':checked')) {
            cy.wrap($checkbox).uncheck();
          }
        });
      }
      clickExistingCourseCheckbox() {
        cy.get('[type="checkbox"]').eq(5).check();
      }


    getAddExistingCoursesSuccessMessage(){
       return cy.get('.Toastify__toast-body').contains("Successfully assigned courses to roadmap.");
    }

    getArchiveRoadmapButton(){
            cy.get('p.text-sm').contains("created this roadmap on");
            cy.get('button.text-black').eq(2).click();
            cy.contains("Yes, I'm sure").click();
    }
            getArchiveSuccessMessage(){
                return cy.get('.Toastify__toast-body').contains("Roadmap status updated successfully.").should('be.visible');
            }
        
    

    NewRoadmapCreation(){
        this.visitContentPage();
        cy.get('.text-2xl').contains("All Roadmaps");
        this.getCreateNewRoadMap();
        this.EnterRoadMapName();
        this.SelectRoadMapCategory();
        this.AddDescription();
        this.getSubmitButton();
        this.getSuccessMessage();
    }

    RoadMapWithWhiteSpaces(){
        this.visitContentPage();
        cy.get('.text-2xl').contains("All Roadmaps");
        this.getCreateNewRoadMap();
        this.BlankRoadMapName();
        this.SelectRoadMapCategory();
        this.BlankRoadmapDescription();
        this.getCancelButton();

    }
    CreateRoadmapWithLimitExceed(){
        this.visitContentPage();
        cy.get('.text-2xl').contains("All Roadmaps");
        this.getCreateNewRoadMap();
        this.RoadmapNameWithExcessCharacters();
        this.SelectRoadMapCategory();
        // this.RoadmapDescriptionWithExcessCharacters();
        this.getCancelButton();
 }

 EditRoadMap(){
    this.visitContentPage();
    cy.get('.text-2xl').contains("All Roadmaps");
    this.getRoadMapsList();
    // this.getRoadMapListToEdit();
    this.getEditRoadmapbutton();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.get('#addRoadmapForm_input_text').clear();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);
    this.EnterRoadMapName();
    // this.UpdateRoadMapName();
    this.UpdateRoadMapCategory();
    cy.get('#addRoadmapForm_textarea_description').clear();
    this.AddDescription();
    this.getSubmitButton();
    this.getEditSuccessMessage

 }

AssignExistingCoursesToRoadMap(){
    this.visitContentPage();
    cy.get('.text-2xl').contains("All Roadmaps");
    this.getRoadMapsList();
    this.getAddExistingCoursesButton();
    this.getExistingCoursesList();
    this.EnsureExistingCoursesUnchecked();
    this.clickExistingCourseCheckbox();
    this.getSubmitButton();
    this.getAddExistingCoursesSuccessMessage();

}

UnassignExistingCoursesToRoadMap(){
    this.visitContentPage();
    cy.get('.text-2xl').contains("All Roadmaps");
    this.getRoadMapsList();
    this.getAddExistingCoursesButton();
    this.getExistingCoursesList();
    this.EnsureExistingCoursesUnchecked();
    cy.contains("Cancel").click();

}

DeleteRoadMap(){
    this.visitContentPage();
    cy.get('.text-2xl').contains("All Roadmaps");
    this.getRoadMapsList();
    // this.getRoadMapListToEdit();
    this.getArchiveRoadmapButton();
    this.getArchiveSuccessMessage();
}
}