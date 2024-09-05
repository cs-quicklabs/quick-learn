import Link from 'next/link';

const Card = () => {
  return (
    <Link
      href="#"
      className="inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group"
    >
      <div className="flex-wrap py-4 px-6 text-gray-900 h-40">
        <h1
          id="message-heading"
          className="font-medium text-gray-900 line-clamp-2 group-hover:underline"
        >
          Backend Developer Roadmap
        </h1>
        <p className="font-normal text-sm text-gray-500 line-clamp-2 mt-2">
          This is Space for learning things related to backend development.
        </p>
        <p className="font-normal text-xs text-gray-500 line-clamp-2 mt-4 pb-2">
          4 Courses, 20 Lessons
        </p>
      </div>
    </Link>
  );
};

export default Card;
