'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  CursorArrowRippleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { getRoadmapCategories } from '@src/apiServices/accountService';
import {
  assignRoadmapsToUser,
  getUserDetails,
  updateUser,
} from '@src/apiServices/teamService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import Card from '@src/shared/components/Card';
import CreateNewCard from '@src/shared/components/CreateNewCard';
import { FullPageLoader } from '@src/shared/components/UIElements';
import AssignDataModal from '@src/shared/modals/assignDataModal';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TRoadmapCategories } from '@src/shared/types/accountTypes';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TCourse } from '@src/shared/types/contentRepository';
import { TUser } from '@src/shared/types/userTypes';
import { HTMLSanitizer } from '@src/utils/helpers';
import {
  showApiErrorInToast,
  showApiMessageInToast,
} from '@src/utils/toastUtils';
import { Tooltip } from 'flowbite-react';

const defaultlinks: TBreadcrumb[] = [{ name: 'Team', link: RouteEnum.TEAM }];

const TeamMemberDetails = () => {
  const param = useParams<{ member: string }>();
  const userUUID = param.member;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [member, setMember] = useState<TUser>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [showConformationModal, setShowConformationModal] =
    useState<boolean>(false);
  const [openAssignModal, setOpenAssignModal] = useState<boolean>(false);
  const [allRoadmapCategories, setAllRoadmapCategories] = useState<
    TRoadmapCategories[]
  >([]);
  const [allCourses, setAllCourses] = useState<TCourse[]>([]);

  useEffect(() => {
    setIsPageLoading(true);
    getRoadmapCategories({
      is_roadmap: true,
      is_courses: true,
    })
      .then((res) => {
        setAllRoadmapCategories(res.data.categories);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      })
      .finally(() => setIsPageLoading(false));
  }, []);

  const getMemberDetails = useCallback(() => {
    setIsPageLoading(true);
    getUserDetails(userUUID, {
      is_load_assigned_roadmaps: true,
      is_load_assigned_courses: true,
    })
      .then((res) => {
        setMember(res.data);
        setLinks([
          ...defaultlinks,
          {
            name: res.data.first_name + ' ' + res.data.last_name,
            link: `${RouteEnum.TEAM}/${userUUID}`,
          },
        ]);
        const courses: TCourse[] = [];
        res.data.assigned_roadmaps?.forEach((roadmap) => {
          if (roadmap.courses.length > 0) {
            courses.push(...roadmap.courses);
          }
        });
        setAllCourses(courses);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      })
      .finally(() => setIsPageLoading(false));
  }, [userUUID]);

  useEffect(() => {
    getMemberDetails();
  }, [userUUID, getMemberDetails]);

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

  const assignCourses = (data: string[]) => {
    setIsPageLoading(true);
    assignRoadmapsToUser(userUUID, { roadmaps: data })
      .then((res) => {
        showApiMessageInToast({
          ...res,
          message: 'Successfully updated assigned courses.',
        });
        setOpenAssignModal(false);
        getMemberDetails();
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsPageLoading(false));
  };

  return (
    <>
      {isPageLoading && !openAssignModal && <FullPageLoader />}
      <ConformationModal
        title="Are you sure you want to deactivate this user?"
        subTitle="When deactivated, this user will no longer be able to access the platform."
        open={showConformationModal}
        setOpen={setShowConformationModal}
        onConfirm={onDeactivateUser}
      />
      <AssignDataModal
        show={openAssignModal}
        setShow={setOpenAssignModal}
        heading={en.teamMemberDetails.assignNewRoadmap}
        sub_heading={en.common.selectRoadmaps}
        data={allRoadmapCategories.map((item) => ({
          name: item.name,
          list: item.roadmaps.map((roadmap) => ({
            name: roadmap.name,
            value: +roadmap.id,
          })),
        }))}
        isLoading={isPageLoading}
        initialValues={{
          selected:
            member?.assigned_roadmaps?.map((item) => item.id.toString()) || [],
        }}
        onSubmit={assignCourses}
      />
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline">
          <h1 className="flex justify-center text-5xl font-extrabold leading-tight capitalize">
            {member?.first_name} {member?.last_name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate sm:flex sm:items-center sm:justify-center">
            ({allRoadmapCategories.length} {en.common.roadmaps},{' '}
            {allCourses.length} {en.common.courses})
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
        <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
            <h1 className="text-3xl font-bold leading-tight capitalize">
              {en.common.roadmaps}
            </h1>
            <p className="mt-1 ml-1 text-sm text-gray-500 truncate lowercase">
              ({member?.assigned_roadmaps?.length ?? 0} {en.common.roadmaps})
            </p>
          </div>
        </div>
        <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
          <div id="created-spaces">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              <li>
                <CreateNewCard
                  title={en.teamMemberDetails.assignNewRoadmap}
                  onAdd={() => setOpenAssignModal(true)}
                />
              </li>
              {member?.assigned_roadmaps?.map((item) => (
                <li key={item.id}>
                  <Card
                    id={item.id.toString()}
                    title={item.name}
                    description={HTMLSanitizer(item.description, false)}
                    link={`/dashboard/content/${item.id}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-8 py-8 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
            <h1 className="text-3xl font-bold leading-tight">
              {en.common.courses}
            </h1>
            <p className="mt-1 ml-1 text-sm text-gray-500 truncate">
              ({allCourses.length ?? 0} {en.contentRepository.courses})
            </p>
          </div>
        </div>
        <div className="relative px-6 grid gap-10 pb-4" id="release_notes">
          <div id="created-spaces">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
              {allCourses.map((item) => (
                <li key={item.id}>
                  <Card
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    link={`/dashboard/content/courses/${item.id}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMemberDetails;
