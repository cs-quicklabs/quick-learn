'use client';
import ReactQuill, { QuillOptions } from 'react-quill';
import { FC, useEffect, useRef } from 'react';
// quill snow theme css
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats, modules } from './EditorToolbar';

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  value: string;
  setValue: (value: string) => void;
}

const Editor: FC<Props> = ({ isEditing, setIsEditing, value, setValue }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    // Set body background color when the component mounts
    document.body.style.backgroundColor = 'white';

    // Cleanup function: Change background when leaving the page
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  /**
   * Sets the first line of the editor content as a header (H1) if it does not exceed 100 characters.
   * If the first line exceeds 100 characters, it breaks the line at the limit and inserts a new line.
   * @return {void}
   */
  const formatFirstLineAsHeader = () => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    const firstLine = editor.getText(0, editor.getLength()).split('\n')[0];
    const headerLengthLimit = 100;

    // Check if the first line exceeds 100 characters
    let adjustedFirstLine = firstLine;
    if (firstLine.length > headerLengthLimit) {
      // Break the line at 100 characters and insert a new line
      adjustedFirstLine =
        firstLine.slice(0, headerLengthLimit) +
        '\n' +
        firstLine.slice(headerLengthLimit);

      // Replace the first line with the new content that breaks at 100 characters
      editor.deleteText(0, firstLine.length);
      editor.insertText(0, adjustedFirstLine);
    }

    // Apply header format (H1) only to the first line
    editor.formatLine(
      0,
      adjustedFirstLine.indexOf('\n') !== -1
        ? adjustedFirstLine.indexOf('\n')
        : adjustedFirstLine.length,
      'header',
      1,
    );
  };

  // Automatically format the first line when content changes
  useEffect(() => {
    if (value.length > 0) {
      formatFirstLineAsHeader();
    }
  }, [value]);

  function onEditorChange(event: string) {
    formatFirstLineAsHeader();
    setValue(event);
  }

  function onUndo() {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    (editor as any).history.redo();
  }

  return (
    <div className="mx-auto max-w-screen-lg bg-white">
      <EditorToolbar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        undo={onUndo}
      />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onEditorChange}
        theme="snow"
        modules={modules}
        formats={formats}
        readOnly={!isEditing}
      />
    </div>
  );
};

export default Editor;
