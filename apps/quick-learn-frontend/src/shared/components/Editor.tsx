'use client';
import ReactQuill from 'react-quill';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats } from './EditorToolbar';
import { en } from '@src/constants/lang/en';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import ConformationModal from '@src/shared/modals/conformationModal';
import { FullPageLoader } from './UIElements';

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

      // Prevent automatic scroll by using preservePosition option
      const range = quill.getSelection(true);
      if (range) {
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

      // Check if any pasted item is an image
      const items = Array.from(clipboard.items);
      const imageItem = items.find((item) => item.type.indexOf('image') !== -1);

      if (imageItem) {
        e.preventDefault();
        e.stopPropagation();
        const file = imageItem.getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
      } else {
        // Allow default paste behavior
        e.preventDefault();
        e.stopPropagation();
        const text = clipboard.getData('text/plain');
        quill.insertText(quill.getSelection()?.index ?? 0, text, 'user');
      }
    };

    // Add event listeners to the Quill editor element
    const editorContainer = quill.root;
    editorContainer.addEventListener('paste', handlePaste, { capture: true });

    // Cleanup
    return () => {
      editorContainer.removeEventListener('paste', handlePaste, {
        capture: true,
      });
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
      keyboard: {
        bindings: {
          // Prevent default paste behavior
          paste: {
            key: 'V',
            shortKey: true,
            handler: (range: unknown, context: unknown) => {
              // Let our paste handler handle it
              return true;
            },
          },
        },
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

  function onUndo() {
    if (!quillRef.current) return;
    // const editor = quillRef.current.getEditor();
    // (editor as any).history.redo();
  }

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        undo={onUndo}
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
