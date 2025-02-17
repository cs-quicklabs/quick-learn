import { LoginPage } from '../test/Login';
import { validCredentials } from '../fixtures/credential';
import { ArchiveUsers } from '../test/ArchiveUsers';

describe('Activate and Delete Users', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.initialize(validCredentials.mail, validCredentials.password);
  });

  it('Verify Super admin should able to search users', () => {
    const ArchiveUser = new ArchiveUsers();
    ArchiveUser.SearchUser();
  });

  it('Verify Super admin should able to Activate users', () => {
    const ArchiveUser = new ArchiveUsers();
    ArchiveUser.ActivateUser();
  });

  it('Verify Super Admin should able to Delete user', () => {
    const ArchiveUser = new ArchiveUsers();
    ArchiveUser.DeleteUser();
  });
});
