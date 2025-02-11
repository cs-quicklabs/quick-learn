import CardSkeleton from './CardSkeleton';

function RoadmapCourseSkeleton() {
  return (
    <div className="bg-gray-50 relative z-0 flex-1 overflow-x-scroll focus:outline-none h-screen">
      <div className="flex justify-center px-8 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center -mt-2 -ml-2">
          <div className="h-4 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
          <div className="h-16 bg-gray-200 rounded w-56 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 ml-2 mt-1 animate-pulse" />
        </div>
      </div>

      <div className="px-8 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline -mt-2 -ml-2">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 ml-2 mt-1 animate-pulse" />
        </div>
      </div>

      <div className="relative px-6 grid gap-10 pb-4">
        <div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-5 xl:gap-x-8">
            {[...Array(5)].map((_, index) => (
              <li key={index}>
                <CardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RoadmapCourseSkeleton;
