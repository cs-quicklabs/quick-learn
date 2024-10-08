import { DateFormats } from '@src/constants/dateFormats';
import { format } from 'date-fns';
import React, { FC } from 'react';

interface Props {
  title: string;
  subtitle: string;
  deactivationDate: string;
  deactivatedBy: string;
  onClickRestore: () => void;
  onClickDelete: () => void;
}

const ArchivedCell: FC<Props> = ({
  title,
  subtitle,
  deactivationDate,
  deactivatedBy,
  onClickDelete,
  onClickRestore,
}) => {
  return (
    <div className="flex items-center mt-4">
      <td className="p-4">
        <div className="flex items-center gap-1">
          <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
            <div>
              <a
                href="/quick-learn/team/1"
                className="truncate hover:text-gray-600 hover:underline"
              >
                <div className="flex text-sm font-medium text-gray-600 truncate">
                  <p>{title}</p>
                  <p className="ml-1 font-normal text-gray-500">{subtitle}</p>
                </div>
              </a>
              <div className="flex-1 w-full mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p>
                    Deactivated on{' '}
                    {format(deactivationDate, DateFormats.shortDate)} by{' '}
                    {deactivatedBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex align-middle items-center justify-end">
          <button
            className="text-gray-500 hover:underline text-sm mr-2"
            onClick={onClickRestore}
          >
            Activate
          </button>
          <button
            className="text-gray-500 hover:text-red-600 hover:underline text-sm"
            onClick={onClickDelete}
          >
            Delete
          </button>
        </div>
      </td>
    </div>
  );
};

export default ArchivedCell;
