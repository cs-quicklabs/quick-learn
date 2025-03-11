'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

interface Props {
  type: string;
  onClickRestore: () => void;
  onClickDelete: () => void;
  isLoading: boolean;
}

const ArchivedDialogbox: FC<Props> = ({
  type,
  onClickRestore,
  onClickDelete,
  isLoading,
}) => {
  return (
    <div className="p-4 mb-4 max-w-2xl text-red-800 border border-red-300 rounded-md bg-red-50">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
          <InformationCircleIcon
            aria-hidden="true"
            className="size-6 text-red-600"
          />
        </div>
        <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg font-medium">Archived</h3>
          <div className="mt-2 mb-4 text-sm">
            This article has been archived by Aashish Dhawan on June 12, 2024.
            This is no longer visible to users but can be restored at any time.
          </div>
        </div>
      </div>
      <div className="sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
        <button
          type="button"
          onClick={onClickRestore}
          disabled={isLoading}
          className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs px-3 py-1.5 me-2 text-center inline-flex items-center"
        >
          Restore {type}
        </button>
        <button
          type="button"
          onClick={onClickDelete}
          disabled={isLoading}
          className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs px-3 py-1.5 text-center"
        >
          Delete Permanently
        </button>
      </div>
    </div>
  );
};

export default ArchivedDialogbox;
