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
  metadata?: {
    addedBy?: string;
    date?: string;
  };
}

const Card: FC<CardProps> = ({
  id,
  title,
  description,
  stats,
  link = '#',
  className = '',
  showWarning = false,
  metadata,
}) => {
  return (
    <Link
      id={id}
      href={link}
      className={`inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full h-full ${className}`}
    >
      <div className="flex flex-col h-48 py-4 px-6 text-gray-900">
        <div>
          <h1
            id="message-heading"
            className="font-medium text-gray-900 line-clamp-3 group-hover:underline capitalize"
          >
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-500 line-clamp-3 mt-2">
            {description}
          </p>
        </div>
        <div className="mt-auto">
          {stats && (
            <p className="font-normal text-xs text-gray-500 capitalize mb-1">
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
          {metadata && (
            <p className="text-xs text-gray-500">
              Added By {metadata.addedBy}
              {metadata.date && (
                <>
                  <span className="mx-1">On</span>
                  {metadata.date}
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;
