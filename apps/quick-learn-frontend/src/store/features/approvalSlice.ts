import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  getUnapprovedLessons,
  approveLesson,
} from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseLoadingState, RootState } from '../types/base.types';

interface ApprovalState extends BaseLoadingState {
  lessons: TLesson[];
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: ApprovalState = {
  lessons: [],
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchUnapprovedLessons = createAsyncThunk(
  'approval/fetchUnapproved',
  async (
    {
      page = 1,
      limit = 10,
      q = '',
    }: { page: number; limit?: number; q: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getUnapprovedLessons({ page, limit, q });
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
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnapprovedLessons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnapprovedLessons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        const { items, page, limit, total, total_pages } = action.payload;

        state.currentPage = page;
        state.limit = limit;
        state.total = total;
        state.totalPages = total_pages;
        state.lessons = items;
      })
      .addCase(fetchUnapprovedLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.error = action.error?.message ?? 'Failed to fetch lessons';
      })
      .addCase(approveLessonThunk.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id.toString() !== action.payload,
        );
        state.total -= 1;
      });
  },
});

const selectApproval = (state: RootState) => state.approval;

export const selectPaginationApprovalList = createSelector(
  [selectApproval],
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

export const { setCurrentPage: setCurrentPageApprovalList } =
  approvalSlice.actions;

export default approvalSlice.reducer;
