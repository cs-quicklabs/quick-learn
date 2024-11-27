import React, { ChangeEvent, FC } from 'react';
import { SearchIcon } from './UIElements';
import { en } from '@src/constants/lang/en';
interface Props {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: FC<Props> = ({ handleChange }) => {
  return (
    <form className="flex-1 min-w-0 mb-6">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        {en.component.search}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full rounded-md border-gray-300 bg-gray-50 py-1.5 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search"
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchBox;
