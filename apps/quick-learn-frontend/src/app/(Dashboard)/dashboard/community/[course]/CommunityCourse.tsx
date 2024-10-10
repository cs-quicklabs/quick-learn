'use client';
import React, { useState, useEffect } from 'react';
import data from "../data"; // Dummy data used for design purpose to be deleted when Courses data is Available
import { useParams } from 'next/navigation';
import CourseCard from '../CourseCard';

type courseCh ={
  id: string;
  name: string;
  title: string;
  createdDate: string;
}

interface Course {
  id: string;
  name: string;
  title: string;
  course: courseCh[];
  publisher: string |undefined;
}

const CommunityCourse = () => {
  const [currCourse, setCurrCourse] = useState<Course | undefined>(undefined);
  const {course} = useParams();  //courseid

  useEffect(() => {
    if (course) {
      const Course = data.find((curr) => curr.id === course);
      setCurrCourse(Course);
    }
  }, [course]);

  return (
    <div>
      {
        currCourse && (<div className='w-full'>
            {/* Heading */}
            <div className="flex flex-col gap-4 text-center">
              <div className="text-5xl font-bold">{currCourse.name}</div>
              <div className="text-sm text-gray-500">{currCourse.title}</div>
              <div className="text-sm  text-gray-500">(20 Courses)</div>
            </div>
              {/* display all courses */}
            <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
              {
                currCourse.course.length>0 ? currCourse.course.map((course)=>{
                  return <li key={course.id} className="col-span-1 hover:shadow-2xl rounded-md cursor-pointer shadow-md"><a href={`#`}><CourseCard  name={course.name} title={course.title} createdDate={course.createdDate}/></a></li>
                }):"No courses yet"
              }
                
            </ul>
          </div>)
      }
    </div>
  );
};

export default CommunityCourse;
