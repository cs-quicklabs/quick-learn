import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { ArchiveRoadmaps } from '../test/ArchiveRoadmaps';
import { CreateNewRoadMap } from '../test/CreateRoadMap';

describe('Activate and Delete Roadmaps', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    cy.get('.text-xl').contains('Sign in to your account');
    loginPage.login(validCredentials.mail, validCredentials.password);

    cy.url().should('include', '/dashboard');
    loginPage.getWelcomeMessage();
  });

  it('Verify Super admin should able to search roadmaps', () => {
    const ArchiveRoadmap = new ArchiveRoadmaps();
    ArchiveRoadmap.SearchRoadmap();
  });

  it('Verify Super admin should able to Activate roadmaps', () => {
    const ArchiveRoadmap = new ArchiveRoadmaps();
    ArchiveRoadmap.ActivateRoadmap();
  });

  it('Verify Super Admin should able to Delete roadmaps', () => {
    // create new roadmap and archive roadmap
    const roadmap = new CreateNewRoadMap();
    roadmap.archiveRoadmap();

    // delete archive course
    const ArchiveRoadmap = new ArchiveRoadmaps();
    ArchiveRoadmap.DeleteRoadmap();
  });
});
