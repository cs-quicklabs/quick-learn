import CourseCard from "./CourseCard";
import data from "./data"   // Dummy data used for design purpose to be deleted when Courses data is Available
import { RouteEnum } from "@src/constants/route.enum";
import {en} from '@src/constants/lang/en'

const CoummintyCourseRepository = () => {
  return (
    <div>
    {/* Heading */}
    <div className="flex flex-col gap-4 text-center">
      <div className="text-5xl font-bold">{en.CommunityCouse.heading}</div>
      <div className="text-sm text-gray-500">{en.CommunityCouse.description}
      </div>
      <div className="text-sm  text-gray-500">({data.length} {en.CommunityCouse.course} )</div>
    </div>
      {/* display all courses */}
    <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
      {
        data.map((course)=>{
          return <li key={course.id} className="col-span-1 hover:shadow-2xl cursor-pointer rounded-lg shadow-md"><a href={`${RouteEnum.COMMUNITY}/${course.id}`}><CourseCard  name={course.name} title={course.title} publisher={course.publisher} /></a></li>
        })
      }
        
    </ul>
  </div>
  )
}

export default CoummintyCourseRepository;