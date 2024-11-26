// store/features/learningPathSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserRoadmapsService } from '@src/apiServices/contentRepositoryService';
import { TUserCourse, TUserRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface LearningPathState {
  roadmaps: TUserRoadmap[];
  courses: TUserCourse[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}

const initialState: LearningPathState = {
  roadmaps: [],
  courses: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const fetchUserContent = createAsyncThunk(
  'learningPath/fetchUserContent',
  async (_, { getState }) => {
    const state = getState() as RootState;

    // If already initialized and has data, skip the fetch
    if (
      state.learningPath.isInitialized &&
      state.learningPath.roadmaps.length > 0
    ) {
      return {
        roadmaps: state.learningPath.roadmaps,
        courses: state.learningPath.courses,
      };
    }

    const response = await getUserRoadmapsService();
    if (!response.success) {
      throw new Error('Failed to fetch user content');
    }

    const userRoadmaps = response.data;
    const allCourses = userRoadmaps.reduce<TUserCourse[]>((acc, roadmap) => {
      if (roadmap.courses) {
        return [...acc, ...roadmap.courses];
      }
      return acc;
    }, []);

    // Remove duplicate courses
    const uniqueCourses = Array.from(
      new Map(allCourses.map((course) => [course.id, course])).values(),
    );

    return {
      roadmaps: userRoadmaps,
      courses: uniqueCourses,
    };
  },
);

const learningPathSlice = createSlice({
  name: 'learningPath',
  initialState,
  reducers: {
    updateCourseProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) {
        course.percentage = progress;
      }
    },
    updateRoadmapProgress: (state, action) => {
      const { roadmapId, progress } = action.payload;
      const roadmap = state.roadmaps.find((r) => r.id === roadmapId);
      if (roadmap) {
        roadmap.percentage = progress;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContent.pending, (state) => {
        if (!state.isInitialized) {
          state.status = 'loading';
        }
      })
      .addCase(fetchUserContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roadmaps = action.payload.roadmaps;
        state.courses = action.payload.courses;
        state.isInitialized = true;
      })
      .addCase(fetchUserContent.rejected, (state, action) => {
        if (!state.isInitialized) {
          state.status = 'failed';
        }
        state.error = action.error.message || null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { updateCourseProgress, updateRoadmapProgress } =
  learningPathSlice.actions;

// Selectors
export const selectUserRoadmaps = (state: RootState) =>
  state.learningPath.roadmaps;
export const selectUserCourses = (state: RootState) =>
  state.learningPath.courses;
export const selectLearningPathStatus = (state: RootState) =>
  state.learningPath.status;
export const selectIsLearningPathInitialized = (state: RootState) =>
  state.learningPath.isInitialized;

export default learningPathSlice.reducer;
