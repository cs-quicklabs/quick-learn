import { RouteEnum } from '../../../constants/route.enum';
import Link from 'next/link';

export const metadata = {
  title: 'Teams • Quick Learn',
  description: 'Teams quick learn',
};

const TeamMemberListing = () => {
  const userTypes: { name: string; code: string }[] = [
    { name: 'Admin', code: 'admin' },
    { name: 'Editors', code: 'editors' },
    { name: 'Members', code: 'members' },
  ];

  const users = [
    {
      name: 'Lindsay Walton',
      role: 'Member',
      email: 'lindsay.walton@example.com',
      skill: 'iOS Developer',
      status: true,
      last_login: 'Nov 11, 2022',
      created_at: 'Dec 11, 2024',
    },
    {
      name: 'Lindsay Walton',
      role: 'Member',
      email: 'lindsay.walton@example.com',
      skill: 'iOS Developer',
      status: true,
      last_login: 'Nov 11, 2022',
      created_at: 'Dec 11, 2024',
    },
    {
      name: 'Lindsay Walton',
      role: 'Member',
      email: 'lindsay.walton@example.com',
      skill: 'iOS Developer',
      status: false,
      last_login: 'Nov 11, 2022',
      created_at: 'Dec 11, 2024',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white shadow-md sm:rounded-sm">
      <div className="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <div>
          <h1 className="mr-3 text-lg font-semibold">Team</h1>
          <p className="text-gray-500 text-sm">
            Manage all your existing <span className="font-bond">4</span> team
            members or add a new one.
          </p>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            className="bg-gray-50 w-64 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            placeholder="Search Members"
          />
          <Link
            href={`${RouteEnum.TEAM}/add`}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-2 focus:ring-primary-300 focus:outline-none"
          >
            Add new member
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-8 p-4 border-t border-b border-gray-300 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
        <p className="items-center hidden text-sm font-medium text-gray-900 md:flex">
          Show records only for:
        </p>
        <div className="space-y-3 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 md:space-x-4">
          {userTypes.map((userType) => (
            <div key={userType.code} className="flex items-center">
              <input
                id={userType.code}
                name="user_type_id"
                type="radio"
                className="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor={userType.code}
                className="ml-2 block text-sm font-medium leading-6 text-gray-900"
              >
                {userType.name}
              </label>
            </div>
          ))}
          <button
            type="button"
            className="underline font-medium text-blue-600 dark:text-blue-500 hover:underline text-sm"
          >
            Show All
          </button>
        </div>
      </div>
      <div className="flow-root">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Primary Skill
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Last Login
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Added On
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-400 hover:bg-gray-100"
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.skill}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.status == true ? 'Active' : 'Inactive'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.last_login}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamMemberListing;
