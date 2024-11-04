import Link from 'next/link';
import { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
  stats?: string;
  id: string;
  link?: string;
  className?: string; // Add this line
}
const Card: FC<CardProps> = ({
  id,
  title,
  description,
  stats,
  link = '#',
  className = '',
}) => {
  return (
    <Link
      id={id}
      href={link}
      className={`inline-block col-span-1 rounded-lg shadow-sm hover:shadow-lg border-gray-100 group w-full ${className}`}
    >
      <div className="flex flex-col h-full py-4 px-6 text-gray-900">
        <div>
          <h1
            id="message-heading"
            className="font-medium text-gray-900 line-clamp-2 h-[48px] group-hover:underline capitalize"
          >
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-500 line-clamp-3 h-[60px] mt-2">
            {description}
          </p>
        </div>
        {stats ? (
          <p className="font-normal text-xs text-gray-500 line-clamp-2 mt-auto pt-4 capitalize">
            {stats}
          </p>
        ) : (
          <div className="mt-auto" />
        )}
      </div>
    </Link>
  );
};

export default Card;
