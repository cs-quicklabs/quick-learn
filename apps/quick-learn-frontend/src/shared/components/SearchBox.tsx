import React, { ChangeEvent, FC } from 'react';

interface Props {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: FC<Props> = ({ value, handleChange }) => {
  return (
    <form className="flex-1 min-w-0 mb-6">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full rounded-md border-gray-300 bg-gray-50 py-1.5 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search"
          value={value}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchBox;
