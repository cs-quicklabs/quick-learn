import { LoginPage } from "../test/Login";
import { CreateNewRoadMap } from "../test/CreateRoadMap";
import { validCredentials } from "../fixtures/credential";

describe('New RoadMap Creation', () => {
    const loginPage = new LoginPage();
    
      beforeEach(() => {
        loginPage.visit();
        cy.get('.text-xl').contains('Sign in to your account');
        loginPage.login(validCredentials.mail, validCredentials.password);
    
        cy.url().should('include', '/dashboard');
        loginPage.getWelcomeMessage().should('contain', 'Successfully logged in.');
      });

      it('Verify user able to create Roadmap', () => {
        const NewRoadmap = new CreateNewRoadMap();
        NewRoadmap.NewRoadmapCreation();
      })

      it('Verify user not able to create empty roadmap', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.RoadMapWithWhiteSpaces();
      })

      it('Verify user not able to create roadmap with exceeded limit', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.CreateRoadmapWithLimitExceed();
      })

      it('Verify user able to Edit roadmap', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.EditRoadMap();
      })

      it('Verify User able to Assign Existing Courses to Roadmap', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.AssignExistingCoursesToRoadMap();
      })

      it('Verify user able to unassign existing courses from roadmap', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.UnassignExistingCoursesToRoadMap();
      })

      it('Verify user able to Delete the Roadmap', () => {
        const NewRoadmap=new CreateNewRoadMap();
        NewRoadmap.DeleteRoadMap();
      })
}) 