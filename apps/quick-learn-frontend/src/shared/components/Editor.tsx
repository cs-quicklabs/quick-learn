'use client';
import ReactQuill from 'react-quill';
import { FC, useCallback, useEffect, useRef } from 'react';
// quill snow theme css
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats } from './EditorToolbar';
import { en } from '@src/constants/lang/en';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import { showApiErrorInToast } from '@src/utils/toastUtils';

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
  const quillRef = useRef<ReactQuill | null>(null);

  // Reference to the Quill editor
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const files = input.files;
      if (files === null || files.length === 0) return;
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      // uploading image for the quill editor
      // TODO: Replace this and find some efficient way
      fileUploadApiCall(formData, 'lesson')
        .then((res) => {
          if (!quillRef.current) return;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', res.data.file);
          console.log(quill.getText());
        })
        .catch((err) => showApiErrorInToast(err));
    };
  }, [quillRef]);

  // Modules object for setting up the Quill editor
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
  };

  useEffect(() => {
    // Set body background color when the component mounts
    document.body.style.backgroundColor = 'white';

    // Cleanup function: Change background when leaving the page
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  function onUndo() {
    if (!quillRef.current) return;
    // const editor = quillRef.current.getEditor();
    // (editor as any).history.redo();
  }

  return (
    <>
      <EditorToolbar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        undo={onUndo}
        isUpdating={isUpdating}
        isAdd={isAdd}
      />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        theme="snow"
        modules={modules}
        formats={formats}
        readOnly={!isEditing}
        placeholder={placeholder}
      />
    </>
  );
};

export default Editor;
