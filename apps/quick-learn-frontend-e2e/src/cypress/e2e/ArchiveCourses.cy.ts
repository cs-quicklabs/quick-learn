import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { ArchiveCourses } from '../test/ArchiveCourses';

describe('Activate and Delete Course', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify Super admin should able to search course', () => {
    const ArchiveCourse = new ArchiveCourses();
    ArchiveCourse.SearchCourse();
  });

  it('Verify Super admin should able to Activate course', () => {
    const ArchiveCourse = new ArchiveCourses();
    ArchiveCourse.ActivateCourse();
  });
  it('Verify Super Admin should able to Delete course', () => {
    const ArchiveCourse = new ArchiveCourses();
    ArchiveCourse.DeleteCourse();
  });
});
