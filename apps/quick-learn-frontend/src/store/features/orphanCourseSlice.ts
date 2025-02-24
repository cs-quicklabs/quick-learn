import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { TCourse } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseLoadingState, RootState } from '../types/base.types';
import { getOrphanCourses } from '@src/apiServices/contentRepositoryService';

interface OrphanCourseState extends BaseLoadingState {
  course: TCourse[];
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: OrphanCourseState = {
  course: [],
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchOrphanCourses = createAsyncThunk(
  'course/orphan',
  async (
    {
      page = 1,
      limit = 10,
      q = '',
    }: { page: number; limit?: number; q: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getOrphanCourses(page, limit, q);
      return response.data;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue(error);
    }
  },
);

const orphanCourseSlice = createSlice({
  name: 'orphanCourse',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrphanCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrphanCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        const { items, page, limit, total, total_pages } = action.payload;

        state.currentPage = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = total_pages;
        state.course = items;
      })
      .addCase(fetchOrphanCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.error = action.error?.message ?? 'Failed to fetch lessons';
      });
  },
});

const selectOrphanCourse = (state: RootState) => state.orphanCourse;

export const selectPaginationOrphanList = createSelector(
  [selectOrphanCourse],
  (data) => ({
    course: data.course || [],
    total: data.total || 0,
    currentPage: data.currentPage || 1,
    limit: data.limit || 10,
    totalPages: data.totalPages || 0,
    isInitialLoad: data.isInitialLoad,
    isLoading: data.isLoading,
  }),
);

export const { setCurrentPage: setCurrentPageOrphanList } =
  orphanCourseSlice.actions;

export default orphanCourseSlice.reducer;
