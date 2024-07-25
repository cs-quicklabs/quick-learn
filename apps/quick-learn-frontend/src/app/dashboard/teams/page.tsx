import { RouteEnum } from '@src/constants/route.enum';
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
            <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-500">
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
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      <Link href={`${RouteEnum.TEAM}/${user.name}`}>
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <div className="inline-flex items-center bg-slate-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                        <svg
                          className="text-gray-800 h-3.5 w-3.5 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.skill}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      <div className="inline-flex items-center">
                        <div
                          className={`w-3 h-3 mr-2 border border-gray-200 rounded-full ${
                            user.status == true ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        {user.status == true ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-4 py-2">{user.last_login}</td>
                    <td className="px-4 py-2">{user.created_at}</td>
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
