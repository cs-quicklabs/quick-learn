'use client';
import ReactQuill, { Quill } from 'react-quill';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats } from './EditorToolbar';
import { en } from '@src/constants/lang/en';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import ConformationModal from '@src/shared/modals/conformationModal';
import { FullPageLoader } from './UIElements';

const Delta = Quill.import('delta');

interface Props {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  value: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  isUpdating?: boolean;
  isAdd?: boolean;
  onArchive?: () => Promise<void>;
}

const Editor: FC<Props> = ({
  isEditing,
  setIsEditing,
  value,
  setValue,
  placeholder = en.common.addContentPlaceholder,
  isUpdating = false,
  isAdd = false,
  onArchive,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Handle archive confirmation
  const handleArchiveConfirm = async () => {
    if (!onArchive) return;

    try {
      setIsArchiving(true);
      await onArchive();
      setShowArchiveModal(false);
    } catch (err) {
      toast.error(en.common.somethingWentWrong);
    } finally {
      setIsArchiving(false);
    }
  };

  // Common function to handle image upload
  const handleImageUpload = async (file: File) => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fileUploadApiCall(formData, 'lesson');

      const range = quill.getSelection(true);
      if (range) {
        // If there's a selection, delete it first
        if (range.length > 0) {
          quill.deleteText(range.index, range.length, 'silent');
        }
        quill.insertEmbed(range.index, 'image', res.data.file, 'user');
        quill.setSelection(range.index + 1, 0, 'silent');
      }
    } catch (err) {
      toast.error('Something went wrong!, please try again');
    }
  };

  // Handle image upload from toolbar
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const files = input.files;
      if (files === null || files.length === 0) return;
      await handleImageUpload(files[0]);
    };
  }, []);

  // Setup paste handler
  useEffect(() => {
    if (!quillRef.current || !isEditing) return;

    const quill = quillRef.current.getEditor();
    const handlePaste = async (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      if (!clipboard?.items) return;

      const items = Array.from(clipboard.items);
      const hasImage = items.some((item) => item.type.indexOf('image') !== -1);
      const hasHtml = clipboard.types.includes('text/html');
      const hasText = clipboard.types.includes('text/plain');
      const range = quill.getSelection(true);

      // If there's HTML content and no images, let Quill handle it by default
      if (hasHtml && !hasImage) {
        e.preventDefault();
        const html = clipboard.getData('text/html');
        const delta = quill.clipboard.convert(html);

        if (range) {
          // If there's a selection, delete it first
          if (range.length > 0) {
            quill.deleteText(range.index, range.length, 'silent');
          }

          // Insert the new content
          quill.updateContents(
            new Delta().retain(range.index).concat(delta),
            'silent',
          );

          // Set the selection after the inserted content
          quill.setSelection(range.index + delta.length(), 0, 'silent');
        }
        return;
      }

      e.preventDefault();

      // Handle image files
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            await handleImageUpload(file);
          }
        }
      }

      // After handling images, insert any text content
      if (hasText && range) {
        const text = clipboard.getData('text/plain');
        const urlRegex = /^(https?:\/\/[^\s]+)$/;

        // If there's a selection, delete it first
        if (range.length > 0) {
          quill.deleteText(range.index, range.length, 'silent');
        }

        if (urlRegex.test(text.trim())) {
          // Insert as a link
          quill.insertText(range.index, text, 'link', text, 'silent');
        } else {
          // Insert as plain text
          quill.insertText(range.index, text, 'silent');
        }

        // Set the selection after the inserted content
        quill.setSelection(range.index + text.length, 0, 'silent');
      }
    };

    // Add event listeners to the Quill editor element
    const editorContainer = quill.root;
    editorContainer.addEventListener('paste', handlePaste);

    // Cleanup
    return () => {
      editorContainer.removeEventListener('paste', handlePaste);
    };
  }, [isEditing]);

  // Modules object for setting up the Quill editor
  const modules = useMemo(
    () => ({
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
      },
    }),
    [imageHandler],
  );

  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isUpdating={isUpdating}
        isAdd={isAdd}
        onArchive={() => setShowArchiveModal(true)}
      />
      <div className="flex-grow relative">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={setValue}
          theme="snow"
          modules={modules}
          formats={formats}
          readOnly={!isEditing}
          placeholder={placeholder}
          className="h-full"
        />
      </div>

      <ConformationModal
        title={en.lesson.archiveConfirmHeading}
        subTitle={en.lesson.archiveConfirmDescription}
        open={showArchiveModal}
        setOpen={setShowArchiveModal}
        onConfirm={handleArchiveConfirm}
      />
      {isArchiving && <FullPageLoader />}
    </div>
  );
};

export default Editor;
