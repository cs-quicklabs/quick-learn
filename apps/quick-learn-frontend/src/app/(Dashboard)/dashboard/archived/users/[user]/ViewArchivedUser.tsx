'use client';
import {
  getUserDailyLessonProgress,
  getUserProgress,
} from '@src/apiServices/lessonsService';
import { getUserDetails } from '@src/apiServices/teamService';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import ActivityGraph, { Course } from '@src/shared/modals/ActivityGraph';
import { TUserDailyProgress } from '@src/shared/types/contentRepository';
import { UserLessonProgress } from '@src/shared/types/LessonProgressTypes';
import { TUser } from '@src/shared/types/userTypes';
import { activateArchivedUser, deleteArchivedUser } from '@src/store/features';
import { useAppDispatch } from '@src/store/hooks';
import {
  calculateRoadmapProgress,
  getInitials,
  getUserType,
} from '@src/utils/helpers';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import ProgressCard from '@src/shared/components/ProgressCard';
import { format } from 'date-fns';
import { DateFormats } from '@src/constants/dateFormats';
import ConformationModal from '@src/shared/modals/conformationModal';
import {
  ArchiveBoxXMarkIcon,
  ArrowLeftEndOnRectangleIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import SkeletonArchiveLoader from './SkeletonArhiveUser';
import ArchivedBanner from '@src/shared/components/ArchivedBanner';

const ViewArchivedUser = () => {
  const { user } = useParams<{ user: string }>();
  const [archivedUser, setArchivedUser] = useState<TUser>();
  const [confirmationData, setConfirmationData] = useState<{
    type: 'restore' | 'delete';
  } | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [userProgress, setUserProgress] = useState<UserLessonProgress[]>([]);
  const [userDailyLessonProgressData, setUserDailyLessonProgressData] =
    useState<TUserDailyProgress[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    fetchTeamMemberDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeamMemberDetails = () => {
    getUserDetails(user, {
      is_load_assigned_roadmaps: true,
      is_load_assigned_courses: true,
    })
      .then((res) => setArchivedUser(res.data))
      .catch((err) => console.log(err));

    getUserProgress(+user)
      .then((res) => setUserProgress(res.data))
      .catch((e) => showApiErrorInToast(e));

    // Set the user's daily lesson progress data
    getUserDailyLessonProgress(+user)
      .then((res) => setUserDailyLessonProgressData(res.data))
      .catch((e) => showApiErrorInToast(e));
  };

  const handleConfirmation = async () => {
    if (!confirmationData) return;

    try {
      if (confirmationData.type === 'restore') {
        await dispatch(activateArchivedUser({ userId: +user })).unwrap();
        toast.success(en.successUserActivate);
      } else {
        await dispatch(deleteArchivedUser({ userId: +user })).unwrap();
        toast.success(en.successUserDelete);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        confirmationData.type === 'restore'
          ? en.errorActivatingUser
          : en.errorDeletingUser,
      );
    } finally {
      router.push(RouteEnum.ARCHIVED_USERS);
      setConfirmationData(null);
    }
  };

  function renderProfileIcon() {
    if (archivedUser?.profile_image) {
      return (
        <Image
          alt=""
          src={archivedUser.profile_image}
          className=" rounded-full object-cover"
          width={80}
          height={80}
        />
      );
    }

    return (
      <span className="text-lg font-medium">
        {getInitials(archivedUser?.first_name, archivedUser?.last_name)}
      </span>
    );
  }

  return (
    <div className="p-4">
      <ConformationModal
        title={
          confirmationData?.type === 'restore'
            ? en.archivedSection.confirmActivateUser
            : en.archivedSection.confirmDeleteUser
        }
        subTitle={
          confirmationData?.type === 'restore'
            ? en.archivedSection.confirmActivateUserSubtext
            : en.archivedSection.confirmDeleteUserSubtext
        }
        open={Boolean(confirmationData)}
        setOpen={() => setConfirmationData(null)}
        onConfirm={handleConfirmation}
      />
      <div className="flex justify-center mb-4">
        {archivedUser && (
          <ArchivedBanner
            type="user"
            archivedBy={archivedUser?.updated_by?.first_name ?? 'SUPER ADMIN'}
            archivedAt={archivedUser?.updated_at ?? ''}
            onRestore={() => setConfirmationData({ type: 'restore' })}
            onDelete={() => setConfirmationData({ type: 'delete' })}
          />
        )}
      </div>
      {archivedUser ? (
        <div className=" w-full bg-white">
          <div className=" flex flex-col lg:flex-row mx-auto  rounded-lg p-6 lg:px-20">
            <div className=" w-full mb-10 lg:w-1/3 flex flex-col gap-2 ">
              <div className="w-20 h-20 mb-2 rounded-full flex items-center justify-center bg-gray-400">
                {renderProfileIcon()}
              </div>
              <div className="flex gap-2 items-center">
                <h2 className="text-xl font-bold mb-2 capitalize">
                  {archivedUser.display_name}
                </h2>
                <p className="text-sm text-slate-600 font-medium">
                  ({archivedUser?.skill?.name ?? ''})
                </p>
              </div>
              <p className=" flex text-gray-700 gap-2 items-center">
                <EnvelopeIcon height={20} width={20} />
                <span className="font-medium">{archivedUser.email}</span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <UserIcon height={20} width={20} />
                <span className="hidden lg:inline-block">User Type:</span>
                <span className="font-medium capitalize">
                  {getUserType(archivedUser.user_type_id)}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <ArrowLeftEndOnRectangleIcon height={20} width={20} />
                <span className="hidden lg:inline-block">Last Login:</span>
                <span className="font-medium ">
                  {format(
                    archivedUser.last_login_timestamp,
                    DateFormats.fullDate,
                  )}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <PencilSquareIcon height={20} width={20} />
                <span className="hidden lg:inline-block">Created At:</span>
                <span className="font-medium">
                  {format(archivedUser.created_at, DateFormats.fullDate)}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <ArchiveBoxXMarkIcon height={20} width={20} />
                <span className="hidden lg:inline-block">Archived on:</span>
                <span className="font-medium">
                  {format(archivedUser.updated_at, DateFormats.fullDate)}
                </span>
              </p>
            </div>
            <div className="w-full lg:w-2/3 flex align-start justify-start ">
              <ActivityGraph
                userProgressData={userProgress as Course[]}
                userDailyProgressData={userDailyLessonProgressData}
                isOpen={openModal}
                setShow={() => {
                  setOpenModal(false);
                }}
                memberDetail={archivedUser as TUser}
                isDialog={false}
              />
            </div>
          </div>
          <div className="lg:px-20 mt-10">
            <div className="text-xl font-bold my-4">Assigned Roadmaps</div>
            {/* display Roadmaps */}
            {archivedUser.assigned_roadmaps?.length === 0 && (
              <p className="text-xl text-center">{en.dashboard.noRoadmaps}</p>
            )}
            <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
              {archivedUser?.assigned_roadmaps?.map((item) => {
                if (item.courses) {
                  return (
                    <ProgressCard
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg w-full cursor-pointer transition-all duration-200 text-left transform"
                      id={item?.id}
                      name={item?.name || ''}
                      title={item?.description || ''}
                      link="#"
                      percentage={calculateRoadmapProgress(item, userProgress)}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      ) : (
        <SkeletonArchiveLoader />
      )}
    </div>
  );
};

export default ViewArchivedUser;
