import { LoginPage } from '../test/Login';
import { Flagged } from '../test/Flagged';
import {
  EditorValidCredentials,
  validCredentials,
} from '../fixtures/credential';

describe('Flagged Lesson', () => {
  const loginPage = new LoginPage();

  it('Verify that only Admin or Super Admin is able to Unflag the lesson of the day', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.UnflagLessonViaSuperAdmin();
  });

  it('Verify that breadcrumbs are not clickable under flagged lesson', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.BreadCrumbsUnclickable();
  });

  it('Verify that the Search functionality is working as expected', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.SearchFlaggedLesson();
  });

  it('Verify that flagged lessons are displayed under flag module', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.getFlaggedLessonList();
  });

  it('Verify that Flagged list is displayed and Unflag lesson option is not present at Editor end', () => {
    loginPage.initialize(
      EditorValidCredentials.EditorMail,
      EditorValidCredentials.EditorPassword,
    );
    const EditorFlag = new Flagged();
    EditorFlag.CannotUnflagViaEditor();
  });

  it('Verify All Columns Name under Flagged lesson list', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.getFlaggedLessonColumnData();
  });

  it('Verify that the Flag badge count matches the Flagged List count ', () => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
    const AdminFlag = new Flagged();
    AdminFlag.MatchFlagAndListCount();
  });
});
