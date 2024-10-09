import React from "react";

interface CourseProps{
  id:string,
  name:string,
  title:string,
  course:any,
  publisher:string
}

const CourseCarousel: React.FC<{ course: CourseProps }> = ({ course }) => {

  return <div id="courseCarousel" className="flex flex-col gap-2 h-40 px-6 py-4 group">
        <h1 id="courseCarouseltitle" className="text-gray-900 line-clamp-1 font-medium group-hover:underline">
          {course.name}
        </h1>
        <div className="font-normal line-clamp-2 text-sm  text-gray-500">{course.title}</div>
        <div className="font-normal line-clamp-1 text-sm text-gray-500">Published by {course?.publisher}</div>
        <div className="font-normal line-clamp-1 text-xs mt-4 text-gray-500">Lesson 20</div>
      </div>;
};

export default CourseCarousel;
