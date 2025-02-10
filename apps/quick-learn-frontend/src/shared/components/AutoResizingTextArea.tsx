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
    // Prevent input if maxLength is reached and the key isn't Backspace or Delete
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
    onChange(e);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className={`w-full capitalize text-3xl md:text-5xl font-bold text-center border-none overflow-hidden resize-none focus:outline-none min-h-[2.5rem] md:min-h-[3.5rem] transition-all ${
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
