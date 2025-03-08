'use client';
import { FC } from 'react';
import { Repository } from './UIElements';

interface Props {
  title: string;
  onAdd: (value: boolean) => void;
  className?: string;
}

const CreateNewCard: FC<Props> = ({
  title,
  onAdd,
  className = 'inline-block col-span-1 rounded-lg bg-white shadow-xs hover:shadow-lg border-gray-100 group w-full',
}) => {
  return (
    <button type="button" className={className} onClick={() => onAdd(true)}>
      <div className="flex flex-col items-center justify-center h-48 py-4 px-6">
        <Repository className="h-12 w-12 text-indigo-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      </div>
    </button>
  );
};

export default CreateNewCard;
