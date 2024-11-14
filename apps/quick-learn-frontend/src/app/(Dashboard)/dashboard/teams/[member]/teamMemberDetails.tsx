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
import { useRouter } from 'next/navigation';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import TeamMemberDetailsSkeleton from './TeamMemberDetailsSkeleton';

const defaultlinks: TBreadcrumb[] = [{ name: 'Team', link: RouteEnum.TEAM }];

const TeamMemberDetails = () => {
  const router = useRouter();
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

        // Create a Map to track unique courses by ID
        const uniqueCoursesMap = new Map<number, TCourse>();

        // Add each course to the map, only if it doesn't exist already
        res.data.assigned_roadmaps?.forEach((roadmap) => {
          if (roadmap.courses?.length > 0) {
            roadmap.courses.forEach((course) => {
              if (!uniqueCoursesMap.has(Number(course.id))) {
                uniqueCoursesMap.set(Number(course.id), course);
              }
            });
          }
        });

        // Convert the Map values back to an array
        setAllCourses(Array.from(uniqueCoursesMap.values()));
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
        router.back();
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

  const hasRoadmaps =
    member?.assigned_roadmaps && member.assigned_roadmaps.length > 0;
  const hasCourses = allCourses.length > 0;

  if (isPageLoading && !openAssignModal) return <TeamMemberDetailsSkeleton />;

  return (
    <>
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

      {/* Rest of the component remains the same */}
      <div className="container mx-auto px-4">
        <Breadcrumb links={links} />

        {/* Member Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold capitalize mb-2">
            {member?.first_name} {member?.last_name}
          </h1>
          <p className="text-sm text-gray-500">
            ({member?.assigned_roadmaps?.length || 0} {en.common.roadmaps},{' '}
            {allCourses.length} {en.common.courses})
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Tooltip content="Edit User">
              <Link
                href={`${RouteEnum.TEAM_EDIT}/${userUUID}`}
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Tooltip>

            <Tooltip content="Deactivate User">
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

            <Tooltip content="User Activities">
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <CursorArrowRippleIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Roadmaps Section */}
        <section className="mb-12">
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold capitalize">
              {en.common.roadmaps}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({member?.assigned_roadmaps?.length ?? 0} {en.common.roadmaps})
            </p>
          </div>

          {hasRoadmaps ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              <CreateNewCard
                title={en.teamMemberDetails.assignNewRoadmap}
                onAdd={() => setOpenAssignModal(true)}
              />
              {member?.assigned_roadmaps?.map((item) => (
                <Card
                  key={item.id}
                  id={item.id.toString()}
                  title={item.name}
                  description={HTMLSanitizer(item.description, false)}
                  link={`/dashboard/content/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="roadmaps"
              customTitle="No roadmaps assigned"
              customDescription="Assign roadmaps to help this team member get started"
              actionButton={{
                label: en.teamMemberDetails.assignNewRoadmap,
                onClick: () => setOpenAssignModal(true),
              }}
            />
          )}
        </section>

        {/* Courses Section */}
        <section>
          <div className="flex items-baseline mb-6">
            <h2 className="text-2xl md:text-3xl font-bold capitalize">
              {en.common.courses}
            </h2>
            <p className="ml-2 text-sm text-gray-500">
              ({allCourses.length} {en.contentRepository.courses})
            </p>
          </div>

          {hasCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              {allCourses.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  description={item.description}
                  link={`/dashboard/content/courses/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="courses"
              customTitle="No courses available"
              customDescription="Courses will appear here when roadmaps are assigned"
            />
          )}
        </section>
      </div>
    </>
  );
};

export default TeamMemberDetails;
