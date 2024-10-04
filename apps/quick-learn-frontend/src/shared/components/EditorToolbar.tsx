import { PencilIcon } from '@heroicons/react/20/solid';
import { CheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: '#toolbar',
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

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
  undo: () => void;
}

// Quill Toolbar component
const EditorToolbar: FC<Props> = ({ isEditing, setIsEditing, undo }) => {
  return (
    <div
      className={
        'mx-auto my-4 h-11 w-max px-4 sticky top-12 z-10 rounded-full flex flex-wrap items-center' +
        ' ' +
        (isEditing ? 'bg-[#e2f0fe] ql-toolbar ql-snow' : 'bg-zinc-200 w-min')
      }
      id="toolbar"
    >
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
        >
          <input
            id="toggle"
            type="checkbox"
            checked={isEditing}
            onChange={() => setIsEditing(!isEditing)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3070b9]"></div>
        </label>
        <button
          type="button"
          className="custom-quill-button"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon height={24} width={24} />
        </button>
      </div>
      <div
        className={
          'items-center border-x-2 border-white gap-1 px-2 mx-2' +
          ' ' +
          (isEditing ? 'flex' : 'hidden')
        }
      >
        <span className="ql-formats" style={{ margin: '0px' }}>
          <select className="ql-header" defaultValue="3">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Normal</option>
          </select>
        </span>
        <span className="ql-formats" style={{ margin: '0px' }}>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
          <button className="ql-link" />
          <button className="ql-list" value="bullet" />
          <button className="ql-list" value="ordered" />
          <button className="ql-image" />
        </span>
      </div>
      <div
        className={
          'flex items-center gap-2' + ' ' + (isEditing ? 'flex' : 'hidden')
        }
      >
        {/* UnComment when the quill issues has beend fixed */}
        {/* <button typeof="button" onClick={undo}>
          <UndoWithTime className="h-5 w-5" />
        </button> */}
        <CheckIcon height={20} width={20} strokeWidth={3} />
      </div>
    </div>
  );
};

export default EditorToolbar;
