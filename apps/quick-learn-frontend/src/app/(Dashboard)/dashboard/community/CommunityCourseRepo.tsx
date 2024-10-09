import CourseCarousel from "./CourseCarousel";
import data from "./data"
import { RouteEnum } from "@src/constants/route.enum";

const CoummintyCourseLayout = () => {
  return (
    <div>
    {/* Heading */}
    <div className="flex flex-col gap-4 text-center">
      <div className="text-5xl font-bold">Community Courses</div>
      <div className="text-sm text-gray-500">Following courses have been made public by community members. You can copy these courses to your organization and make changes as per your requirements.

      </div>
      <div className="text-sm  text-gray-500">(20 Courses)</div>
    </div>
      {/* display all courses */}
    <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4 2xl:grid-cols-5">
      {
        data.map((course)=>{
          return <li key={course.id} className="col-span-1 hover:shadow-2xl cursor-pointer rounded-lg shadow-md"><a href={`${RouteEnum.COMMUNITY}/${course.id}`}><CourseCarousel  course={course}/></a></li>
        })
      }
        
    </ul>
  </div>
  )
}

export default CoummintyCourseLayout