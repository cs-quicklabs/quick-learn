import React from "react";

interface CourseCardProps{
  id:string,
  name:string,
  title:string,
  createdDate:string
}

const CourseCard: React.FC<{ course: CourseCardProps }> = ({ course }) => {

  return <div id="courseCarousel" className="flex flex-col gap-2 h-40 px-3 py-4 md:px-3 md:py-4 group">
        <h1 id="courseCarouseltitle" className="text-gray-900 line-clamp-1 font-medium group-hover:underline">
          {course.name}
        </h1>
        <div className="font-normal line-clamp-2 text-sm  text-gray-500">{course.title}</div>
        <div className="font-normal line-clamp-1 text-xs mt-4 text-gray-500">Lesson {course.createdDate}</div>
      </div>;
};

export default CourseCard;
