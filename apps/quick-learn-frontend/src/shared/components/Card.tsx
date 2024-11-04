import Link from 'next/link';
import { FC } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

interface CardProps {
  title: string;
  description: string;
  stats?: string;
  id: string;
  link?: string;
  className?: string;
  showWarning?: boolean;
}

const Card: FC<CardProps> = ({
  id,
  title,
  description,
  stats,
  link = '#',
  className = '',
  showWarning = false,
}) => {
  return (
    <Link
      id={id}
      href={link}
      className={`inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full ${className}`}
    >
      <div className="flex flex-col h-48 py-4 px-6 text-gray-900">
        <div>
          <h1
            id="message-heading"
            className="font-medium text-gray-900 line-clamp-2 group-hover:underline capitalize"
          >
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-500 line-clamp-3 mt-2">
            {description}
          </p>
        </div>
        {stats && (
          <p className="font-normal text-xs text-gray-500 line-clamp-2 mt-auto pt-4 capitalize">
            {showWarning ? (
              <span className="inline-flex items-center">
                <ExclamationTriangleIcon
                  className="text-yellow-500 mr-1"
                  height={16}
                  width={16}
                />
                {stats}
              </span>
            ) : (
              stats
            )}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Card;
