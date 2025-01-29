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
}

const initialState: ApprovalState = {
  lessons: [],
  isLoading: true,
  isInitialLoad: true,
  error: null,
};

export const fetchUnapprovedLessons = createAsyncThunk(
  'approval/fetchUnapproved',
  async () => {
    const response = await getUnapprovedLessons().catch(
      (error: AxiosErrorObject) => {
        showApiErrorInToast(error);
        throw error;
      },
    );

    return response.data;
  },
);

export const approveLessonThunk = createAsyncThunk(
  'approval/approveLesson',
  async (id: string) => {
    await approveLesson(id).catch((error: AxiosErrorObject) => {
      showApiErrorInToast(error);
      throw error;
    });

    return id;
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
        state.error = action.error.message;
      })
      .addCase(approveLessonThunk.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id.toString() === action.payload,
        );
      });
  },
});

export const getApprovalLessonCount = (state: RootState) =>
  state.approval.lessons.length;

export default approvalSlice.reducer;
