import React, { ChangeEvent, FC } from 'react';
import { SearchIcon } from './UIElements';
import { en } from '@src/constants/lang/en';

interface Props {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: FC<Props> = ({ handleChange }) => {
  return (
    <div className="flex-1 min-w-0 mb-6 ">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        {en.component.search}
      </label>
      <div className="relative rounded-md shadow-xs">
        <div className="absolute inset-y-0 start-0 flex items-center  ps-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full rounded-md border-gray-300 bg-gray-50 py-1.5 pl-10 text-sm  h-[36px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-700  "
          placeholder="Search"
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default SearchBox;
