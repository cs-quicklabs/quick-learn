import React from 'react';
import ViewArchivedLesson from './ViewArchivedLesson';

export const metadata = {
  title: 'Archived Lesson • Quick Learn',
  description: 'Archived Lesson quick learn',
};

const page = () => {
  return (
    <div>
      <ViewArchivedLesson />
    </div>
  );
};

export default page;
