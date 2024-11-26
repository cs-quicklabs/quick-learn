// store/features/approvalSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TLesson } from '@src/shared/types/contentRepository';
import {
  getUnapprovedLessons,
  approveLesson,
} from '@src/apiServices/lessonsService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface ApprovalState {
  lessons: TLesson[];
  isLoading: boolean;
  isInitialLoad: boolean;
  error: string | null;
}

const initialState: ApprovalState = {
  lessons: [],
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchUnapprovedLessons = createAsyncThunk(
  'approval/fetchUnapproved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnapprovedLessons();
      return response.data;
    } catch (error) {
      showApiErrorInToast(error as AxiosErrorObject);
      return rejectWithValue('Failed to fetch unapproved lessons');
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
      return rejectWithValue('Failed to approve lesson');
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
        state.lessons = action.payload;
      })
      .addCase(fetchUnapprovedLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false;
        state.error = action.payload as string;
      })
      .addCase(approveLessonThunk.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id.toString() === action.payload,
        );
      });
  },
});

export default approvalSlice.reducer;
