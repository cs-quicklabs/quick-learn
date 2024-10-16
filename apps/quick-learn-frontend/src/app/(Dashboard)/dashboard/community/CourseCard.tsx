import React from 'react';
import { FC } from 'react';


interface CourseProps {
  name: string;
  title: string;
  publisher?: string; //optional (Displayed when on the Community Course List)
  createdDate?: string; //optional (Displayed when on the Coummunity Course)
  lesson?:number|undefined;
}

const CourseCard: FC<CourseProps> = ({
  name,
  title,
  publisher = '',
  createdDate = '',
  lesson=0
}) => {
  return (
    <div
      id="courseCarousel"
      className="flex flex-col gap-2 h-40 px-6 py-4 group"
    >
      <h1
        id="courseCarouseltitle"
        className="text-gray-900 line-clamp-1 font-medium group-hover:underline"
      >
        {name}
      </h1>
      <div className="font-normal line-clamp-2 h-[38px] text-sm  text-gray-500">
        {title}
      </div>
      {publisher && (
        <p className="font-medium line-clamp-1 text-sm text-gray-500 ">
          Published by {publisher}
        </p>
      )}
     {createdDate ? (<div className="font-normal line-clamp-1 text-xs underline text-gray-500">
        {createdDate ? `Added on ${createdDate}}` : `(Lesson 20)`}
      </div>)
      :
      <div className="font-normal line-clamp-1 text-xs underline text-gray-500">
        Lesson ({lesson})
      </div>}
    </div>
  );
};

export default CourseCard;
