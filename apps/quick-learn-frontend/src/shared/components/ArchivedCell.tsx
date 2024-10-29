import { DateFormats } from '@src/constants/dateFormats';
import { format } from 'date-fns';
import React, { FC } from 'react';
import { en } from '@src/constants/lang/en';
import { CalenderIcon } from './UIElements';

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
  <div className="flex items-center p-4 mt-4">
    <div className="flex-1 min-w-0">
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
    <div className="flex items-center p-4">
      <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex text-sm font-medium text-gray-600 truncate">
            <p className="truncate max-w-[200px] capitalize">{title}</p>
            <p className="ml-1 font-normal text-gray-500">{subtitle}</p>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <CalenderIcon />
              <p>
                {en.common.deactivatedOn}{' '}
                {format(deactivationDate, DateFormats.shortDate)} {en.common.by}{' '}
                {deactivatedBy}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="text-sm text-gray-500 hover:text-red-600 hover:underline"
          onClick={onClickRestore}
          disabled={isLoading}
        >
          {!alternateButton ? en.common.restore : en.common.activate}
        </button>
        <button
          className="text-sm text-gray-500 hover:text-red-600 hover:underline ml-4"
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
