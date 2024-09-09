'use client';
import {
  CursorArrowRippleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { getUserDetails, updateUser } from '@src/apiServices/teamService';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import { FullPageLoader } from '@src/shared/components/UIElements';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TUser } from '@src/shared/types/userTypes';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { Tooltip } from 'flowbite-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultlinks: TBreadcrumb[] = [{ name: 'Team', link: RouteEnum.TEAM }];

const TeamMemberDetails = () => {
  const param = useParams<{ member: string }>();
  const userUUID = param.member;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [member, setMember] = useState<TUser>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [showConformationModal, setShowConformationModal] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPageLoading(true);
    getUserDetails(userUUID)
      .then((res) => {
        setMember(res.data);
        setLinks([
          ...defaultlinks,
          {
            name: res.data.first_name + ' ' + res.data.last_name,
            link: `${RouteEnum.TEAM}/${userUUID}`,
          },
        ]);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      })
      .finally(() => setIsPageLoading(false));
  }, [userUUID]);

  const onDeactivateUser = () => {
    if (!member) return;
    setIsPageLoading(true);
    updateUser(userUUID, { active: 'false' })
      .then((res) => {
        setMember({ ...member, active: false });
        showApiMessageInToast({
          ...res,
          message: 'User deactivated successfully',
        });
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  };

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      <ConformationModal
        title="Are you sure you want to deactivate this user?"
        subTitle="When deactivated, this user will no longer be able to access the platform."
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onDeactivateUser}
      />
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline">
          <h1 className="flex justify-center text-5xl font-extrabold leading-tight capitalize">
            {member?.first_name} {member?.last_name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate sm:flex sm:items-center sm:justify-center">
            (10 Roadmaps, 20 Courses)
          </p>
          <div className="sm:flex sm:items-center sm:justify-center gap-2 mt-2">
            <Tooltip
              content="Edit User"
              trigger="hover"
              className="py-1 px-2 max-w-sm text-xs font-normal text-white bg-gray-900 rounded-sm shadow-sm tooltip"
            >
              <Link
                href={RouteEnum.TEAM_EDIT + '/' + userUUID}
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Tooltip>
            <Tooltip
              content="Deactivate User"
              trigger="hover"
              className="py-1 px-2 max-w-sm text-xs font-normal text-white bg-gray-900 rounded-sm shadow-sm tooltip"
            >
              <button
                type="button"
                className={`text-black bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center ${
                  member?.active === false
                    ? 'cursor-not-allowed'
                    : 'hover:bg-red-800 hover:text-white'
                }`}
                onClick={() => setShowConformationModal(true)}
                disabled={member?.active === false}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip
              content="User Activities"
              trigger="hover"
              className="py-1 px-2 max-w-sm text-xs font-normal text-white bg-gray-900 rounded-sm shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <CursorArrowRippleIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMemberDetails;
