import React from 'react';
import { FC } from 'react';

interface CourseProps {
  name: string;
  title: string;
  publisher?: string; //optional (Displayed when on the Community Course List)
  createdDate?: string; //optional (Displayed when on the Coummunity Course)
  lesson?: number | undefined;
}

const CourseCard: FC<CourseProps> = ({
  name,
  title,
  publisher = '',
  createdDate = '',
  lesson = 0,
}) => {
  return (
    <div
      id="courseCarousel"
      className="inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full px-6 py-4 group"
    >
      <h1
        id="courseCarouseltitle"
        className="text-gray-900 h-[48px] line-clamp-2 font-medium group-hover:underline"
      >
        {name}
      </h1>
      <div className="font-normal line-clamp-3 text-sm h-[60px] text-gray-500">
        {title}
      </div>
      {publisher && (
        <p className="font-medium line-clamp-1 mt-2 text-sm text-gray-500 ">
          Published by {publisher}
        </p>
      )}
      {createdDate ? (
        <div className="font-normal line-clamp-1 mt-4 text-xs text-gray-500">
          {`Added on ${createdDate}`}
        </div>
      ) : (
        <div className="font-normal line-clamp-1 text-xs mt-2  text-gray-500">
          Lesson ({lesson})
        </div>
      )}
      <div className="h-[42px]" />
    </div>
  );
};

export default CourseCard;
