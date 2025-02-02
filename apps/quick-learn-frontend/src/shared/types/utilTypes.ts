export type DebounceFunction<T> = (...args: T[]) => void;

export type PaginateWrapper<T> = {
  items: T;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};
export type FileUploadResponse = {
  file: string;
  type: string;
};

export interface FlaggedLesson {
  id: number;
  flagged_on: string;
  updated_at: string;
  created_at: string;
  course_id: string;
  lesson_id: string;
  lesson: {
    name: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    first_name: string;
    last_name: string;
  };
}
