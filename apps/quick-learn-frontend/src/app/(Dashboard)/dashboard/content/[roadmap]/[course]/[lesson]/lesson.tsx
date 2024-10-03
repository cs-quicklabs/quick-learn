'use client';
import Editor from '@src/shared/components/Editor';
import useDashboardStore from '@src/store/dashboard.store';
import { useEffect, useState } from 'react';

const Lesson = () => {
  const { setHideNavbar } = useDashboardStore((state) => state);
  const [value, setValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true);

  useEffect(() => {
    setHideNavbar(true);
    return () => {
      setHideNavbar(false);
    };
  }, []);

  return (
    <>
      <Editor
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        value={value}
        setValue={setValue}
      />
    </>
  );
};

export default Lesson;
