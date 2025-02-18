import { firstLetterCapital } from '@src/utils/helpers';
import { ChangeEvent, useEffect, useRef } from 'react';

interface AutoResizingTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isEditing: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

function AutoResizingTextarea({
  value,
  onChange,
  isEditing,
  placeholder,
  className = '',
  maxLength = 80,
}: AutoResizingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    const { selectionStart: cursorPosition } = target;

    // Prevent input if maxLength is reached and get new value
    const newValue =
      target.value.length > maxLength
        ? target.value.slice(0, maxLength)
        : target.value;

    // Call onChange with the modified event
    onChange({
      ...e,
      target: {
        ...target,
        value: firstLetterCapital(newValue),
      },
    });

    adjustHeight();

    // Restore cursor position after React updates the input
    requestAnimationFrame(() => {
      target.selectionStart = cursorPosition;
      target.selectionEnd = cursorPosition;
    });
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className={`w-full text-3xl md:text-5xl font-bold text-center border-none overflow-hidden resize-none focus:outline-none min-h-[2.5rem] md:min-h-[3.5rem] transition-all ${
        !isEditing ? 'focus:ring-0' : ''
      } ${className}`}
      placeholder={placeholder}
      readOnly={!isEditing}
      rows={1}
      maxLength={maxLength}
      // For accessibility
      aria-label="Lesson title"
    />
  );
}

export default AutoResizingTextarea;
