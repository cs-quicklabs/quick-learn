import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRoadmaps } from '@src/apiServices/contentRepositoryService';
import { TRoadmap, TCourse } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseAsyncState } from '../types/base.types';

interface RoadmapsState extends BaseAsyncState {
  roadmaps: TRoadmap[];
  courses: TCourse[];
}

const initialState: RoadmapsState = {
  roadmaps: [],
  courses: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const fetchRoadmaps = createAsyncThunk<
  TRoadmap[],
  void,
  { rejectValue: string }
>('roadmaps/fetchRoadmaps', async (_, { rejectWithValue }) => {
  try {
    const response = await getRoadmaps();
    return response.data;
  } catch (error) {
    return rejectWithValue(
      (error as AxiosErrorObject).message || 'Failed to fetch roadmaps',
    );
  }
});

const roadmapsSlice = createSlice({
  name: 'roadmaps',
  initialState,
  reducers: {
    addRoadmap: (state, action: PayloadAction<TRoadmap>) => {
      state.roadmaps.unshift(action.payload);

      // Update courses array with unique courses
      const newCourses = action.payload.courses || [];
      newCourses.forEach((course) => {
        if (!state.courses.some((c) => c.id === course.id)) {
          state.courses.push(course);
        }
      });

      // Sort courses alphabetically
      state.courses.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
    },

    updateRoadmap: (state, action: PayloadAction<TRoadmap>) => {
      const index = state.roadmaps.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.roadmaps[index] = action.payload;
      }

      // Update courses array
      const updatedCourses = action.payload.courses || [];
      updatedCourses.forEach((course) => {
        const courseIndex = state.courses.findIndex((c) => c.id === course.id);
        if (courseIndex === -1) {
          state.courses.push(course);
        } else {
          state.courses[courseIndex] = course;
        }
      });

      // Sort courses alphabetically
      state.courses.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
    },

    removeRoadmap: (state, action: PayloadAction<string>) => {
      const roadmapId = action.payload;
      state.roadmaps = state.roadmaps.filter((r) => r.id !== roadmapId);

      // Update courses array - remove courses that are no longer in any roadmap
      const allCourses = new Set<string>();
      state.roadmaps.forEach((roadmap) => {
        (roadmap.courses || []).forEach((course) => {
          allCourses.add(course.id);
        });
      });

      state.courses = state.courses.filter((course) =>
        allCourses.has(course.id),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmaps.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRoadmaps.fulfilled,
        (state, action: PayloadAction<TRoadmap[]>) => {
          state.status = 'succeeded';
          state.roadmaps = action.payload;

          // Update courses array with unique courses from all roadmaps
          const coursesMap = new Map<string, TCourse>();
          action.payload.forEach((roadmap) => {
            (roadmap.courses || []).forEach((course) => {
              coursesMap.set(course.id, course);
            });
          });

          // Convert to array and sort alphabetically
          state.courses = Array.from(coursesMap.values()).sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
          );

          state.isInitialized = true;
        },
      )
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { addRoadmap, updateRoadmap, removeRoadmap } =
  roadmapsSlice.actions;

// Selectors
export const selectAllRoadmaps = (state: RootState): TRoadmap[] =>
  state.roadmaps.roadmaps ?? initialState.roadmaps;

export const selectRoadmapById = (
  state: RootState,
  roadmapId: string,
): TRoadmap | undefined =>
  state.roadmaps.roadmaps.find((roadmap) => roadmap.id === roadmapId);

export const selectAllCourses = (state: RootState): TCourse[] =>
  state.roadmaps.courses ?? initialState.courses;

export const selectRoadmapsStatus = (
  state: RootState,
): RoadmapsState['status'] => state.roadmaps.status;

export const selectIsRoadmapsInitialized = (state: RootState): boolean =>
  state.roadmaps.isInitialized;

export default roadmapsSlice.reducer;
