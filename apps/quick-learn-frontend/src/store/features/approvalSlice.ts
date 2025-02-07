import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  getUnapprovedLessons,
  approveLesson,
} from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseLoadingState } from '../types/base.types';
import { RootState } from '../store';

interface ApprovalState extends BaseLoadingState {
  lessons: TLesson[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean; // New property to track if more pages exist
}

const initialState: ApprovalState = {
  lessons: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: true,
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchUnapprovedLessons = createAsyncThunk(
  'approval/fetchUnapproved',
  async (
    { page = 1, limit = 10 }: { page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await getUnapprovedLessons({ page, limit });
      return response.data;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue(error);
    }
  },
);

export const approveLessonThunk = createAsyncThunk(
  'approval/approveLesson',
  async (id: string, { rejectWithValue }) => {
    try {
      await approveLesson(id);
      return id;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue(error);
    }
  },
);

const approvalSlice = createSlice({
  name: 'approval',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnapprovedLessons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnapprovedLessons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        const { data, page, limit, total, total_pages } = action.payload;

        state.page = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = total_pages;
        // Append lessons if not on the first page, otherwise replace them
        state.lessons = page === 1 ? data : [...state.lessons, ...data];

        // Determine if there are more pages to fetch
        state.hasMore = page < total_pages;
      })
      .addCase(fetchUnapprovedLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.error = action.error?.message || 'Failed to fetch lessons';
      })
      .addCase(approveLessonThunk.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id.toString() !== action.payload,
        );
        state.total -= 1;
      });
  },
});

export const getApprovalLessonCount = (state: RootState) =>
  state.approval.lessons.length;

export const selectPagination = (state: RootState) => ({
  page: state.approval.page,
  limit: state.approval.limit,
  total: state.approval.total,
  totalPages: state.approval.totalPages,
  hasMore: state.approval.hasMore,
});

export default approvalSlice.reducer;
