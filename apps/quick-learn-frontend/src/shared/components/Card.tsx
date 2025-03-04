import { FC, useRef, useEffect, useState } from 'react';
import { ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/20/solid';
import { en } from '@src/constants/lang/en';
import { SuperLink } from '@src/utils/HiLink';

interface CardProps {
  title: string;
  description: string;
  stats?: string;
  id: string;
  link?: string;
  className?: string;
  showWarning?: boolean;
  isCreateCard?: boolean;
  onClick?: () => void;
  metadata?: {
    addedBy?: string;
    date?: string;
  };
}

interface CardContentProps
  extends Omit<CardProps, 'link' | 'className' | 'onClick'> {
  isLongTitle: boolean;
  titleRef: React.RefObject<HTMLHeadingElement>;
}

// Moved CardContent outside of Card component
const CardContent: FC<CardContentProps> = ({
  isCreateCard,
  title,
  titleRef,
  description,
  isLongTitle,
  stats,
  showWarning,
  metadata,
}) => {
  return (
    <div
      className={`flex flex-col h-[193.5px] md:h-48 ${
        isLongTitle ? ' px-6 md:px-4 py-4' : 'py-4 px-6'
      } text-gray-900`}
    >
      {isCreateCard && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlusIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <div className={isCreateCard ? 'invisible' : ''}>
        <h1
          ref={titleRef}
          id="message-heading"
          className="text-sm md:text-base font-medium first-letter:uppercase text-gray-900  line-clamp-2 md:line-clamp-3 group-hover:underline mb-2"
        >
          {title}
        </h1>
        <p
          className={`text-xs md:text-sm font-normal first-letter:uppercase  text-gray-500 ${
            isLongTitle
              ? 'line-clamp-3 md:line-clamp-1'
              : 'line-clamp-3 md:line-clamp-2'
          } text-sm whitespace-pre-line`}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>

      <div className={` mt-auto ${isLongTitle ? 'space-y-0.5' : 'space-y-1'}`}>
        {stats && !isCreateCard && (
          <p className="font-normal text-[10px] md:text-xs first-letter:uppercase text-gray-500">
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
        {metadata && !isCreateCard && (metadata.addedBy || metadata.date) && (
          <p className="text-[10px] md:text-xs text-gray-500">
            {metadata.addedBy ? (
              <>
                {en.component.addedBy} {metadata.addedBy}
              </>
            ) : (
              en.component.Added
            )}
            {metadata.date && (
              <>
                <span className="mx-1">{en.component.on}</span>
                {metadata.date}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

const Card: FC<CardProps> = ({
  id,
  title,
  description,
  stats,
  link = '#',
  className = '',
  showWarning = false,
  isCreateCard = false,
  onClick,
  metadata,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLongTitle, setIsLongTitle] = useState(false);

  useEffect(() => {
    const checkTitleHeight = () => {
      if (titleRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(titleRef.current).lineHeight,
          10,
        );
        const titleHeight = titleRef.current.scrollHeight;
        setIsLongTitle(titleHeight > lineHeight * 2);
      }
    };

    checkTitleHeight();
    window.addEventListener('resize', checkTitleHeight);
    return () => window.removeEventListener('resize', checkTitleHeight);
  }, [title]);

  const baseClassName = `inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group w-full relative ${
    isCreateCard
      ? 'border-2 border-dashed border-gray-300 hover:border-gray-400'
      : ''
  } ${className}`;

  const cardContentProps = {
    isLongTitle,
    titleRef,
    title,
    description,
    stats,
    showWarning,
    isCreateCard,
    metadata,
    id,
  };

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClassName} type="button">
        <CardContent {...cardContentProps} />
      </button>
    );
  }

  return (
    <SuperLink id={id} href={link} className={baseClassName}>
      <CardContent {...cardContentProps} />
    </SuperLink>
  );
};

export default Card;
