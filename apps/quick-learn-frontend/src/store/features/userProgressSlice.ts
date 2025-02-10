import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getUserProgress } from '@src/apiServices/lessonsService';

// Types
interface UserLessonProgress {
  lesson_id: number;
  completed_date: string;
}

export interface CourseProgress {
  course_id: number;
  lessons: UserLessonProgress[];
}

interface UserProgressState {
  progress: CourseProgress[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: UserProgressState = {
  progress: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching user progress
export const fetchUserProgress = createAsyncThunk(
  'userProgress/fetchUserProgress',
  async () => {
    const response = await getUserProgress();
    return response.data;
  },
);

// Slice
const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch user progress';
      });
  },
});

// Selectors
const selectBaseUserProgress = (state: RootState) => state.userProgress;

export const selectUserProgress = createSelector([selectBaseUserProgress], (userProgress) => userProgress.progress);
export const selectUserProgressStatus = createSelector([selectBaseUserProgress], (userProgress) => userProgress.status);
export const selectUserProgressError = createSelector([selectBaseUserProgress], (userProgress) => userProgress.error);

export const selectCourseProgress = (courseId: number) => createSelector(
  [selectBaseUserProgress],
  (userProgress) => userProgress.progress.find((course) => course.course_id === courseId)?.lessons || []
);
export default userProgressSlice.reducer;
