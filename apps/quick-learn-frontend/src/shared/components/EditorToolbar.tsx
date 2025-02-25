import { PencilIcon } from '@heroicons/react/20/solid';
import { ArrowPathIcon, CheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { en } from '@src/constants/lang/en';
// Formats objects for setting up the Quill editor
export const formats = [
  'header',
  'bold',
  'italic',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'code-block',
];

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isUpdating: boolean;
  isAdd: boolean;
}

// Quill Toolbar component
const EditorToolbar: FC<Props> = ({
  isEditing,
  setIsEditing,
  isUpdating,
  isAdd,
}) => {
  return (
    <div
      className={
        'mx-auto my-4 px-4 sticky top-12 z-10 ' +
        'flex flex-col md:flex-row rounded-full md:h-11 md:w-max ' +
        'items-center gap-1 py-3 md:py-0 ' +
        (isEditing
          ? 'bg-[#e2f0fe] ql-toolbar ql-snow'
          : 'bg-zinc-200 md:w-min ')
      }
      id="toolbar"
    >
      {/* View/Edit toggle section with status icon on mobile */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="custom-quill-button"
            onClick={() => setIsEditing(false)}
          >
            <EyeIcon height={24} width={24} />
          </button>
          <label
            htmlFor="toggle"
            className="inline-flex items-center cursor-pointer"
            aria-label="Toggle editing mode"
          >
            <input
              id="toggle"
              type="checkbox"
              checked={isEditing}
              onChange={() => setIsEditing(!isEditing)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3070b9]" />
          </label>
          <button
            type="button"
            className="custom-quill-button"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon height={24} width={24} />
          </button>
        </div>

        {/* Status indicator on mobile - placed in the first row */}
        {!isAdd && isEditing && (
          <div
            className={
              'flex md:hidden items-center gap-2 text-white p-[4px] rounded-full ' +
              (isUpdating ? 'bg-amber-400 ' : 'bg-[#3070b9] ')
            }
          >
            {isUpdating ? (
              <ArrowPathIcon height={16} width={16} strokeWidth={3} />
            ) : (
              <CheckIcon height={16} width={16} strokeWidth={3} />
            )}
          </div>
        )}
      </div>

      {/* Divider for mobile */}
      {isEditing && <div className="w-full h-px bg-white md:hidden" />}

      {/* Formatting tools section */}
      <div
        className={
          'items-center w-full md:w-auto justify-center ' +
          'md:border-l-2 md:border-l-white gap-1 px-2 md:mx-2 ' +
          (isEditing ? 'flex ' : 'hidden ') +
          (!isAdd ? 'md:border-r-2 md:border-r-white ' : ' ')
        }
      >
        <span className="ql-formats" style={{ margin: '0px' }}>
          <select className="ql-header" defaultValue="3">
            <option value="1">{en.component.heading1}</option>
            <option value="2">{en.component.heading2}</option>
            <option value="3">{en.component.normal}</option>
          </select>
        </span>
        <span className="ql-formats" style={{ margin: '0px' }}>
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-blockquote" />
          <button type="button" className="ql-code-block" />
          <button type="button" className="ql-link" />
          <button type="button" className="ql-list" value="bullet" />
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-image" />
        </span>
      </div>

      {/* Status indicator for desktop */}
      {!isAdd && isEditing && (
        <div
          className={
            'hidden md:flex items-center gap-2 text-white p-[4px] rounded-full ' +
            // (isEditing ? 'flex ' : 'hidden ') +
            (isUpdating ? 'bg-amber-400 ' : 'bg-[#3070b9] ')
          }
        >
          {isUpdating ? (
            <ArrowPathIcon height={16} width={16} strokeWidth={3} />
          ) : (
            <CheckIcon height={16} width={16} strokeWidth={3} />
          )}
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
