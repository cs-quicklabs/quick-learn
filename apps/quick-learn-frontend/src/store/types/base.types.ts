// base.types.ts
import { store } from '../store';

export type RootState = ReturnType<typeof store.getState>;
export interface BaseLoadingState {
  isLoading: boolean;
  isInitialLoad: boolean;
  error?: string | null; // Made optional since ArchivedState doesn't use it
}

export interface BasePaginationState {
  page: number;
  hasMore: boolean;
  searchValue: string;
}

export interface BaseAsyncState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}

export interface PaginatedCollectionState<T>
  extends BaseLoadingState,
  BasePaginationState {
  items: T[];
}

export interface AsyncCollection<T> extends BaseAsyncState {
  items: T[];
}

// Helper function to create initial state for paginated collections
export const createInitialPaginatedState = <
  T,
>(): PaginatedCollectionState<T> => ({
  items: [],
  isLoading: false,
  isInitialLoad: true,
  hasMore: true,
  page: 1,
  searchValue: '',
});
