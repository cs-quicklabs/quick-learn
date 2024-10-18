import React from 'react';
import CommunityCourse from './CommunityCourse';

export const metadata = {
  title: 'Free Courses, Community course',
  description: 'Quickly Learn thorugh these courses',
};

const page = () => {
  return (
    <div>
      <CommunityCourse />
    </div>
  );
};

export default page;
