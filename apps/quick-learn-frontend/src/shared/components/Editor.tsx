'use client';
import ReactQuill from 'react-quill';
import { FC, useEffect, useRef } from 'react';
// quill snow theme css
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats, modules } from './EditorToolbar';
import { en } from '@src/constants/lang/en';

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
}

const Editor: FC<Props> = ({
  isEditing,
  setIsEditing,
  value,
  setValue,
  placeholder = en.common.addContentPlaceholder,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

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
