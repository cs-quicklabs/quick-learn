const SkeletonArchiveLoader = () => {
  return (
    <div className="p-2 animate-pulse">
      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-gray-300 h-36 rounded-lg" />
      </div>
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300" />
            <div className="h-6 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-70 bg-gray-300 rounded" />
            <div className="h-4 w-70 bg-gray-300 rounded" />
            <div className="h-4 w-70 bg-gray-300 rounded" />
          </div>
          <div className="w-full lg:w-2/3 flex flex-col gap-4 mt-6 lg:mt-0">
            <div className="h-60 bg-gray-300 rounded-lg" />
          </div>
        </div>
        <div className="mt-10">
          <span className="h-6 w-48 bg-gray-300 rounded block" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-300 rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonArchiveLoader;
