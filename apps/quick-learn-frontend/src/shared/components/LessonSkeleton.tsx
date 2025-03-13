const LessonSkeleton = ({ isEdit = false }) => {
  return (
    <div className="-mt-4">
      <div className="mx-auto max-w-screen-lg p-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="h-4 bg-gray-300 rounded w-24" />
        </div>

        {/* Title Skeleton */}
        <div className="h-8 bg-gray-300 rounded mb-4" />

        {/* Content Skeleton */}
        <div className="h-90 bg-gray-300 rounded mb-4" />

        {isEdit && (
          <>
            {/* Save Button Skeleton */}
            <div className="fixed bottom-4 right-4 h-10 w-32 bg-gray-300 rounded-full" />

            {/* Archive Button Skeleton */}
            <div className="fixed bottom-4 left-4 h-10 w-32 bg-gray-300 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
};

export default LessonSkeleton;
