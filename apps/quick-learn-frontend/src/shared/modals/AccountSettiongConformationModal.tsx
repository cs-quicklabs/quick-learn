import React from 'react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';

interface Props {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function AccountSettingConformationModal({
  title,
  description,
  open,
  setOpen,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 px-4 md:px-0 overscroll-none"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[39rem] max-h-full dark:bg-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 p-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-400">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-5 font-xs text-gray-500 border-b border-gray-200 dark:border-gray-600">
            {description}
          </div>

          {/* Footer */}
          <div className="p-4">
            <button
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 uppercase"
              onClick={() => setOpen(false)}
            >
              {en.common.ok}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
