'use client';
import {
  ArrowRightEndOnRectangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  getRoadmap,
  updateRoadmap,
} from '@src/apiServices/contentRepositoryService';
import { DateFormats } from '@src/constants/dateFormats';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import Breadcrumb from '@src/shared/components/Breadcrumb';
import { FullPageLoader } from '@src/shared/components/UIElements';
import AddEditRoadMapModal from '@src/shared/modals/addEditRoadMapModal';
import { TBreadcrumb } from '@src/shared/types/breadcrumbType';
import { TCreateRoadmap, TRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { format } from 'date-fns';
import { Tooltip } from 'flowbite-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultlinks: TBreadcrumb[] = [
  { name: en.contentRepository.contentRepository, link: RouteEnum.CONTENT },
];

const RoadmapDetails = () => {
  const { roadmap } = useParams<{ roadmap: string }>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [roadmapData, setRoadmapData] = useState<TRoadmap>();
  const [links, setLinks] = useState<TBreadcrumb[]>(defaultlinks);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    getRoadmap(roadmap)
      .then((res) => {
        setRoadmapData(res.data);
        setLinks([
          ...defaultlinks,
          {
            name: res.data.name,
            link: `${RouteEnum.CONTENT}/${roadmap}`,
          },
        ]);
      })
      .catch((err) => {
        showApiErrorInToast(err);
      })
      .finally(() => setIsPageLoading(false));
  }, [roadmap]);

  function onEdit(data: TCreateRoadmap) {
    setIsLoading(true);
    updateRoadmap(roadmap, data)
      .then(() => {
        setOpenAddModal(false);
        if (!roadmapData) return;
        setRoadmapData({ ...roadmapData, ...data });
      })
      .catch((err) => showApiErrorInToast(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      {isPageLoading && <FullPageLoader />}
      <AddEditRoadMapModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        isAdd={false}
        onSubmit={onEdit}
        isloading={isloading}
        initialData={roadmapData}
      />
      <div>
        <Breadcrumb links={links} />
        <div className="items-baseline">
          <h1 className="text-center text-5xl font-extrabold leading-tight capitalize">
            {roadmapData?.name}
          </h1>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            <span className="capitalize">
              {roadmapData?.created_by?.full_name ?? 'Admin'}
            </span>
            &nbsp;{en.contentRepository.createdThisRoadmapOn}&nbsp;
            {roadmapData?.created_at &&
              format(roadmapData?.created_at, DateFormats.shortDate)}
          </p>
          <p className="mt-1 ml-1 text-sm text-gray-500 truncate text-center">
            ({roadmapData?.courses?.length ?? 0} {en.contentRepository.courses},
            &nbsp;
            {roadmapData?.lessons_count ?? 0} {en.common.lessons}, &nbsp;
            {roadmapData?.users_count ?? 0} {en.common.participants})
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Tooltip
              content={en.contentRepository.editRoadmap}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
                onClick={() => setOpenAddModal(true)}
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip
              content={en.contentRepository.addOnAlreadyExistingCourse}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip
              content={en.contentRepository.archiveRoadmap}
              trigger="hover"
              className="py-2 px-3 max-w-sm text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip"
            >
              <button
                type="button"
                className="text-black bg-gray-300 hover:bg-red-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapDetails;
