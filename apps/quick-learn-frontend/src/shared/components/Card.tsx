import Link from 'next/link';
import { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
  stats?: string;
  id: string;
  link?: string;
}

const Card: FC<CardProps> = ({ id, title, description, stats, link = '#' }) => {
  return (
    <Link
      id={id}
      href={link}
      className="inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full"
    >
      <div className="flex-wrap py-4 px-6 text-gray-900">
        <h1
          id="message-heading"
          className="font-medium text-gray-900 line-clamp-2 h-[48px] group-hover:underline capitalize"
        >
          {title}
        </h1>
        <p className="font-normal text-sm text-gray-500 line-clamp-3 h-[60px] mt-2">
          {description}
        </p>
        {stats ? (
          <p className="font-normal text-xs text-gray-500 line-clamp-2 mt-4 pb-2 capitalize">
            {stats}
          </p>
        ) : (
          <div className="h-[42px]" />
        )}
      </div>
    </Link>
  );
};

export default Card;
