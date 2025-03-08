'use client';
import { FC, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type ReactQuillType from 'react-quill-new';

// All the import which is used for the customisation of the editor
import EditorToolbar, { formats } from './EditorToolbar';
import { en } from '@src/constants/lang/en';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import { showErrorMessage } from '@src/utils/helpers';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
});

function checkSize(file: File): boolean {
  if (file.size > 1024 * 1024 * 5) {
    showErrorMessage('File should be less than 5MB.');
    return false;
  }
  return true;
}

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  isUpdating?: boolean;
  isAdd?: boolean;
}

const Editor: FC<Props> = ({
  isEditing,
  setIsEditing,
  value,
  setValue,
  placeholder = en.common.addContentPlaceholder,
  isUpdating = false,
  isAdd = false,
}) => {
  const quillRef = useRef<ReactQuillType>(null);

  const handleImageUpload = async (file: File) => {
    if (!checkSize(file)) return;
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fileUploadApiCall(formData, 'lesson');

      const range = quill.getSelection(true);
      if (range) {
        if (range.length > 0) {
          quill.deleteText(range.index, range.length);
        }
        quill.insertEmbed(range.index, 'image', res.data.file, 'user');
        quill.setSelection(range.index + 1, 0);
      }
    } catch (err) {
      console.log(err);
      showErrorMessage('Something went wrong!, please try again');
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const { files } = input;
      if (files === null || files.length === 0) return;
      await handleImageUpload(files[0]);
    };
  }, []);

  const modules = {
    toolbar: {
      container: '#toolbar',
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
      matchers: [],
    },
  };

  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleRefChange = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isEditing && handleRefChange.current) {
      const preventScroll = () => {
        // Save the current scroll position before format change
        const scrollPosition = window.scrollY;

        // Use setTimeout to restore position after the format change
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto', // Use 'auto' to avoid smooth scrolling animation
          });
        }, 0);
      };
      const quilEditorContainer = document.querySelector('.quillHeader');

      if (quilEditorContainer) {
        quilEditorContainer.addEventListener('click', preventScroll);
      }

      // Clean up event listener
      return () => {
        quilEditorContainer?.removeEventListener('click', preventScroll);
      };
    }
  }, [isEditing]);

  return (
    <div
      className="quillHeader flex flex-col h-full mx-4"
      ref={handleRefChange}
    >
      <EditorToolbar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isUpdating={isUpdating}
        isAdd={isAdd}
      />
      <div className="grow relative">
        <ReactQuill
          // @ts-expect-error - As forwardRef is not supported in react 19 and we have to wait for the next version of react-quill
          ref={quillRef}
          value={value}
          onChange={setValue}
          theme="snow"
          modules={modules}
          formats={formats}
          readOnly={!isEditing}
          placeholder={placeholder}
          className="h-full mb-12"
          style={{ lineHeight: '2rem' }}
        />
      </div>
    </div>
  );
};

export default Editor;
