import React from "react";
import { FC } from "react";

interface CourseProps{
  name:string,
  title:string,
  publisher?:string //optional (Displayed when on the Community Course List)
  createdDate?:string  //optional (Displayed when on the Coummunity Course)
}

const CourseCard: FC<CourseProps> = ({ name, title, publisher='',createdDate='' }) => {

  return <div id="courseCarousel" className="flex flex-col gap-2 h-40 px-6 py-4 group">
        <h1 id="courseCarouseltitle" className="text-gray-900 line-clamp-1 font-medium group-hover:underline">
          {name}
        </h1>
        <div className="font-normal line-clamp-2 text-sm  text-gray-500">{title}</div>
        {publisher && <div className="font-medium line-clamp-1 text-sm text-gray-500 ">Published by {publisher}</div>}
        <div className="font-normal line-clamp-1 text-xs mt-4 text-gray-500">{createdDate ? `Added on ${createdDate}` : `(Lesson 20)` }</div>
      </div>;
};

export default CourseCard;
