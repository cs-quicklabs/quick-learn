import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';

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
      className={`inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full h-full min-w-[300px] max-w-md ${className}`}
    >
      <div className="flex flex-col h-48 py-4 px-6 text-gray-900">
        <div>
          <h1
            id="message-heading"
            className="font-medium text-gray-900 line-clamp-3 min-h-[4.5rem] group-hover:underline capitalize"
          >
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-500 line-clamp-3 mt-2">
            {description}
          </p>
        </div>
        <div className="mt-4 pt-2 border-t border-gray-100">
          {stats && (
            <p className="font-normal text-xs text-gray-500 capitalize mb-1">
              {showWarning ? (
                <span className="inline-flex items-center">
                  <ExclamationTriangleIcon className="text-yellow-500 mr-1 h-4 w-4" />
                  {stats}
                </span>
              ) : (
                stats
              )}
            </p>
          )}
          {metadata && (metadata.addedBy || metadata.date) && (
            <p className="text-xs text-gray-500">
              {metadata.addedBy ? <>Added By {metadata.addedBy}</> : <>Added</>}
              {metadata.date && (
                <>
                  <span className="mx-1">on</span>
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
