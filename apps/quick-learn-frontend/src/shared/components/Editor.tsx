'use client';
import ReactQuill, { Quill } from 'react-quill';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats } from './EditorToolbar';
import { en } from '@src/constants/lang/en';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';

const Clipboard = Quill.import('modules/clipboard');
const Delta = Quill.import('delta');

class CustomClipboard extends Clipboard {
  async onPaste(e: ClipboardEvent) {
    e.preventDefault();

    const range = this.quill.getSelection();
    if (!range) return;

    const clipboard = e.clipboardData;
    if (!clipboard?.items) return;

    // Check for images in clipboard
    const items = Array.from(clipboard.items);
    const imageItem = items.find((item) => item.type.indexOf('image') !== -1);

    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fileUploadApiCall(formData, 'lesson');

          if (range.length > 0) {
            this.quill.deleteText(range.index, range.length);
          }

          this.quill.insertEmbed(range.index, 'image', res.data.file, 'user');
          this.quill.setSelection(range.index + 1, 0);
        } catch (err) {
          toast.error('Failed to upload image. Please try again.');
        }
        return;
      }
    }

    // Handle HTML content if available and no images
    const html = clipboard.getData('text/html');
    if (html && !imageItem) {
      const delta = this.quill.clipboard.convert(html);
      this.quill.updateContents(
        new Delta().retain(range.index).delete(range.length).concat(delta),
        'user',
      );
      this.quill.setSelection(range.index + delta.length(), 0);
      return;
    }

    // Fall back to plain text
    const text = clipboard.getData('text/plain');
    if (text) {
      const delta = new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert(text);

      this.quill.updateContents(delta, 'user');
      this.quill.setSelection(range.index + text.length, 0);
    }
  }
}

Quill.register('modules/clipboard', CustomClipboard, true);

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
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const handleImageUpload = async (file: File) => {
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
      toast.error('Something went wrong!, please try again');
    }
  };

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
        matchers: [],
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
    </div>
  );
};

export default Editor;
