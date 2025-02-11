import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  SearchedQuery,
  SearchedLesson,
  SearchedCourseOrRoadpmap,
} from '../types/contentRepository';
import { getSearchQuery } from '@src/apiServices/learningPathService';
import RouteTab from './RouteTab';
import { en } from '@src/constants/lang/en';

const SEARCH_CATEGORIES = ['Roadmaps', 'Courses', 'Lessons'] as const;
const MINIMUM_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 500;
const STORAGE_KEY = 'searchHistory';

interface NavbarSearchBoxProps {
  isMember: boolean;
}

function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-full mb-2" />
    </div>
  );
}

const NavbarSearchBox: React.FC<NavbarSearchBoxProps> = ({ isMember }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchedQuery>({
    Roadmaps: [],
    Courses: [],
    Lessons: [],
  });
  const [searchHistory, setSearchHistory] = useState<SearchedQuery>({
    Roadmaps: [],
    Courses: [],
    Lessons: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const baseRoute = useMemo(
    () => (isMember ? '/dashboard/learning-path' : '/dashboard/content'),
    [isMember],
  );

  // Load search history on component mount
  useEffect(() => {
    if (isDropdownActive) {
      loadSearchHistory();
    }
  }, [isDropdownActive]);

  const loadSearchHistory = () => {
    try {
      const history = localStorage.getItem(STORAGE_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Fetch search results
  useEffect(() => {
    const fetchResults = setTimeout(() => {
      if (searchQuery.trim().length >= MINIMUM_SEARCH_LENGTH) {
        setIsLoading(true);
        getSearchQuery(searchQuery)
          .then((res) => {
            setSearchResults(
              res?.data || { Roadmaps: [], Courses: [], Lessons: [] },
            );
            setIsLoading(false);
          })
          .catch((error) => console.error('Search query error:', error));
      } else {
        setSearchResults({ Roadmaps: [], Courses: [], Lessons: [] });
      }
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(fetchResults);
    };
  }, [searchQuery]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveToHistory = (
    category: keyof SearchedQuery,
    item: SearchedLesson | SearchedCourseOrRoadpmap,
  ): SearchedQuery => {
    try {
      const existingHistory = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ||
          JSON.stringify({ Roadmaps: [], Courses: [], Lessons: [] }),
      );

      // Check if item already exists in history
      const categoryHistory = existingHistory[category];
      const itemExists = categoryHistory.some(
        (historyItem: SearchedLesson | SearchedCourseOrRoadpmap) =>
          historyItem.id === item.id,
      );

      if (!itemExists) {
        // Add new item to the beginning of the array
        existingHistory[category] = [item, ...categoryHistory].slice(0, 10); // Keep last 10 items
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingHistory));
      }

      return existingHistory;
    } catch (error) {
      console.error('Error saving to search history:', error);
      return searchHistory; // Return current history if error occurs
    }
  };

  const handleClick = (
    category: keyof SearchedQuery,
    item: SearchedCourseOrRoadpmap | SearchedLesson,
  ) => {
    const updatedHistory = handleSaveToHistory(category, item);
    setSearchHistory(updatedHistory); // Immediately update the history state
    setIsDropdownActive(false);
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSearchHistory({ Roadmaps: [], Courses: [], Lessons: [] });
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  // Check if there are any results across all categories
  const hasNoResults =
    searchQuery.length >= MINIMUM_SEARCH_LENGTH &&
    SEARCH_CATEGORIES.every((category) => searchResults[category].length === 0);

  const hasHistory = SEARCH_CATEGORIES.some(
    (category) => searchHistory[category].length > 0,
  );

  // Render results for a specific category (either search results or history)
  const renderCategoryResults = (
    category: (typeof SEARCH_CATEGORIES)[number],
    items: SearchedLesson[] | SearchedCourseOrRoadpmap[],
    isHistoryView = false,
  ) => {
    if (items.length === 0) return null;

    return (
      <div key={category}>
        <div className="flex font-bold border-b border-gray-300 pl-3 py-1 justify-between">
          <span>
            <span className=' className="text-slate-600 text-md'>
              {category}{' '}
            </span>
          </span>
          <span className="mr-6 flex items-center">
            {isHistoryView && <ClockIcon className="inline-block h-5 w-5 " />}
          </span>
        </div>
        <div
          className="max-h-[120px] overflow-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item) => {
            const commonProps = {
              id: item.id,
              name: item.name,
              baseLink: baseRoute,
              onClick: () => handleClick(category, item),
            };

            if (category === 'Lessons') {
              const lesson = item as SearchedLesson;
              return (
                <RouteTab
                  {...commonProps}
                  key={`lesson_${item.id}`}
                  type="lesson"
                  course_id={lesson.course_id}
                  course_name={lesson.course_name}
                />
              );
            }

            return (
              <RouteTab
                {...commonProps}
                key={item.id}
                type={category.toLowerCase() as 'roadmaps' | 'courses'}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative flex-1" ref={dropdownRef}>
        {/* Search Input Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>

        {/* Search Input */}
        <input
          id="search"
          name="search"
          type="search"
          autoComplete="off"
          value={searchQuery}
          placeholder="Search Roadmaps, Courses or Lessons"
          onFocus={() => setIsDropdownActive(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full h-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 text-sm sm:leading-6 outline-0"
        />

        {/* Search Results Dropdown */}
        {isDropdownActive && (
          <div className="absolute w-full top-[43px] text-gray-800 bg-white border border-gray-300 rounded-md p-1 pb-2 overflow-y-auto shadow-lg">
            {searchQuery.length < MINIMUM_SEARCH_LENGTH ? (
              hasHistory ? (
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-500 p-2 border-b">
                    <span>Recent search</span>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Clear History</span>
                    </button>
                  </div>
                  {SEARCH_CATEGORIES.map((category) =>
                    renderCategoryResults(
                      category,
                      searchHistory[category],
                      true,
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 p-2">
                  {en.Search.default_text}
                </div>
              )
            ) : isLoading ? (
              <div className="text-center text-gray-500 p-2">
                {/* add a loading skeleton */}
                <SearchSkeleton />
              </div>
            ) : hasNoResults ? (
              <div className="text-center text-gray-500 p-2 text-sm">
                {en.Search.no_search_result_found}
              </div>
            ) : (
              <div>
                {SEARCH_CATEGORIES.map((category) =>
                  renderCategoryResults(category, searchResults[category]),
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarSearchBox;
