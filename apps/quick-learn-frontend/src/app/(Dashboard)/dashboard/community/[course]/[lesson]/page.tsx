import React from 'react';
import Lesson from './Lesson';

export const metadata = {
  title: 'Free Lessons, Community course',
  description: 'Quickly Learn thorugh these courses, Lessons',
};

const page = () => {
  return (
    <div>
      <Lesson />
    </div>
  );
};

export default page;
