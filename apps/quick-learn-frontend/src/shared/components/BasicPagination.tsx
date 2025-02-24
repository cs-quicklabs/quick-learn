import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { en } from '@src/constants/lang/en';

interface Props {
  readonly total: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onChange: (pageIndex: number) => void;
}

function BasicPagination({ total, currentPage, totalPages, onChange }: Props) {
  function showRange() {
    const initial = total === 0 ? 0 : (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, total);
    return `${initial} ${en.teams.to} ${end} ${en.teams.of} ${total}`;
  }

  return (
    <div className=" flex items-center justify-between my-5 sm:flex-1  ">
      <div>
        <p className="text-sm text-gray-700">
          {en.teams.showing} <span className="font-medium">{showRange()}</span>{' '}
          {en.teams.results}
        </p>
      </div>
      <div>
        <div className="flex">
          {currentPage > 1 && (
            <button
              type="button"
              id="prev"
              onClick={() => onChange(currentPage - 1)}
              className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowLeftIcon height={20} width={32} />
              {en.teams.previous}
            </button>
          )}
          {currentPage < totalPages && (
            <button
              type="button"
              id="next"
              onClick={() => onChange(currentPage + 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              {en.teams.next}
              <ArrowRightIcon height={20} width={32} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BasicPagination;
