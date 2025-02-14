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
