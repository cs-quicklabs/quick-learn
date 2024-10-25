import { DateFormats } from '@src/constants/dateFormats';
import { format } from 'date-fns';
import React, { FC } from 'react';
import { en } from '@src/constants/lang/en';

interface Props {
  title: string;
  subtitle: string;
  deactivationDate: string;
  deactivatedBy: string;
  onClickRestore: () => void | null;
  onClickDelete: () => void | null;
  alternateButton?: boolean;
  isLoading?: boolean;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-[1fr,180px] gap-4 w-full items-center p-4 mt-4">
    <div className="min-w-0">
      <div className="flex">
        <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-24 ml-1 animate-pulse"></div>
      </div>
      <div className="mt-2 flex items-center">
        <div className="h-5 w-5 bg-gray-200 rounded-full mr-1.5 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
    </div>
    <div className="flex justify-end space-x-4">
      <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
      <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
    </div>
  </div>
);

const ArchivedCell: FC<Props> = ({
  title,
  subtitle,
  deactivationDate,
  deactivatedBy,
  onClickDelete,
  onClickRestore,
  alternateButton,
  isLoading = false,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-[1fr,180px] gap-4 w-full items-center p-4 mt-4">
      <div className="min-w-0">
        <div className="flex text-sm font-medium text-gray-600">
          <p className="truncate max-w-[200px] capitalize">{title}</p>
          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
            {subtitle}
          </p>
        </div>
        <div className="mt-2">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="whitespace-nowrap">
              {en.common.deactivatedOn}{' '}
              {format(deactivationDate, DateFormats.shortDate)} {en.common.by}{' '}
              {deactivatedBy}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 h-full items-center">
        <button
          className="text-gray-500 hover:underline text-sm whitespace-nowrap"
          onClick={onClickRestore}
          disabled={isLoading}
        >
          {!alternateButton ? en.common.restore : en.common.activate}
        </button>
        <button
          className="text-gray-500 hover:text-red-600 hover:underline text-sm whitespace-nowrap"
          onClick={onClickDelete}
          disabled={isLoading}
        >
          {en.common.delete}
        </button>
      </div>
    </div>
  );
};

export default ArchivedCell;
