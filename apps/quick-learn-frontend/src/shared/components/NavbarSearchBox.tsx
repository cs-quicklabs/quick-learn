import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { SearchedQuery } from '../types/contentRepository';
import { getSearchQuery } from '@src/apiServices/learningPathService';
import RouteTab from './RouteTab';

const Readables = ['Roadmaps', 'Courses', 'Lessons'];

const NavbarSearchBox = () => {
  const [onActive, setOnActive] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchedQuery>();

  useEffect(() => {
    const fetchSearchQuery = setTimeout(() => {
      if (query.trim().length >= 3) {
        getSearchQuery(query)
          .then((res) => setResult(res?.data))
          .catch((e) => console.log('error', e));
      } else {
        setResult({
          Roadmaps: [],
          Courses: [],
          Lessons: [],
        });
      }
    }, 500);
    return () => clearTimeout(fetchSearchQuery);
  }, [query]);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          id="search"
          name="search"
          type="search"
          value={query}
          placeholder="Search Roadmaps, Courses or Lessons"
          onFocus={() => setOnActive(true)}
          onBlur={() => setOnActive(false)}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full h-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
        />
        {onActive && (
          <div className="absolute w-full top-[48px] text-black bg-white border rounded-md p-1 z-50">
            <div className="flex flex-col">
              <div className="font-bold text-slate-700">
                # Roadmap{' '}
                <span className="text-sm text-gray-700 italic font-normal">
                  ({result?.Roadmaps.length} roadmaps)
                </span>
              </div>
              {result?.Roadmaps && (
                <div>
                  {result.Roadmaps.map((roadmap) => (
                    <RouteTab id={roadmap.id} name={roadmap.name} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-slate-700">
                # Courses{' '}
                <span className="text-sm text-gray-700 italic font-normal">
                  ({result?.Courses.length} courses)
                </span>
              </div>
              {result?.Roadmaps && (
                <div>
                  {result.Courses.map((course) => (
                    <RouteTab id={course.id} name={course.name} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="font-bold text-slate-700">
                # Lessons{' '}
                <span className="text-sm text-gray-700 italic font-normal">
                  ({result?.Lessons.length} lessons)
                </span>
              </div>
              {result?.Lessons && (
                <div>
                  {result.Lessons.map((lesson) => (
                    <RouteTab
                      id={lesson.id}
                      name={lesson.name}
                      course_id={lesson.course_id}
                      roadmap_id={lesson.roadmap_id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarSearchBox;
