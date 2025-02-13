import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { TFlaggedLesson } from '@src/shared/types/contentRepository';
import {
  getFlaggedLessons,
  markLessonAsUnFlagged,
} from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseLoadingState, RootState } from '../types/base.types';

interface FlaggedState extends BaseLoadingState {
  lessons: TFlaggedLesson[];
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: FlaggedState = {
  lessons: [],
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchFlaggedLessons = createAsyncThunk(
  'flagged/fetchUnapproved',
  async (
    {
      page = 1,
      limit = 10,
      q = '',
    }: { page: number; limit?: number; q: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getFlaggedLessons(page, limit, q);
      return response.data;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue(error);
    }
  },
);

export const unflagLessonThunk = createAsyncThunk(
  'approval/approveLesson',
  async (id: string, { rejectWithValue }) => {
    try {
      await markLessonAsUnFlagged(id);
      return id;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue(error);
    }
  },
);

const flaggedSlice = createSlice({
  name: 'unflagged',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlaggedLessons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFlaggedLessons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        const { items, page, limit, total, total_pages } = action.payload;

        state.currentPage = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = total_pages;
        state.lessons = items;
      })
      .addCase(fetchFlaggedLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.error = action.error?.message ?? 'Failed to fetch lessons';
      })
      .addCase(unflagLessonThunk.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id.toString() !== action.payload,
        );
        state.total -= 1;
      });
  },
});

const selectUnflagged = (state: RootState) => state.flagged;

export const selectPaginationFlaggedList = createSelector(
  [selectUnflagged],
  (data) => ({
    lessons: data.lessons || [],
    total: data.total || 0,
    currentPage: data.currentPage || 1,
    limit: data.limit || 10,
    totalPages: data.totalPages || 0,
    isInitialLoad: data.isInitialLoad,
    isLoading: data.isLoading,
  }),
);

export const { setCurrentPage: setCurrentPageFlaggedList } =
  flaggedSlice.actions;

export default flaggedSlice.reducer;
