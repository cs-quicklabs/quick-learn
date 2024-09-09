'use client';
import { FC } from 'react';
import { Repository } from './UIElements';

interface Props {
  title: string;
  onAdd: (value: boolean) => void;
}

const CreateNewCard: FC<Props> = ({ title, onAdd }) => {
  return (
    <button
      type="button"
      className="inline-block col-span-1 rounded-lg bg-white shadow-sm hover:shadow-lg border-gray-100 group content-center cursor-pointer px-1"
      onClick={() => onAdd(true)}
    >
      <div className="text-center content-center w-80 h-40">
        <Repository className="mx-auto h-12 w-12 text-indigo-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      </div>
    </button>
  );
};

export default CreateNewCard;
