import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { BaseAsyncState, RootState } from '../types/base.types';
import { getRoadmaps } from '@src/apiServices/contentRepositoryService';
import { TRoadmap, TCourse } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';

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

// Helper function to sort items alphabetically by name
const sortByName = <T extends { name: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
};

export const fetchRoadmaps = createAsyncThunk<
  TRoadmap[],
  void,
  { rejectValue: string }
>('roadmaps/fetchRoadmaps', async (_, { rejectWithValue }) => {
  try {
    const response = await getRoadmaps();
    return sortByName(response.data);
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
      state.roadmaps = sortByName(state.roadmaps);

      // Update courses array with unique courses
      const newCourses = action.payload.courses || [];
      newCourses.forEach((course) => {
        if (!state.courses.some((c) => c.id === course.id)) {
          state.courses.push(course);
        }
      });

      state.courses = sortByName(state.courses);
    },

    updateRoadmap: (state, action: PayloadAction<TRoadmap>) => {
      const index = state.roadmaps.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.roadmaps[index] = action.payload;
        state.roadmaps = sortByName(state.roadmaps);
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

      state.courses = sortByName(state.courses);
    },

    removeRoadmap: (state, action: PayloadAction<string>) => {
      state.roadmaps = sortByName(
        state.roadmaps.filter((r) => r.id !== +action.payload),
      );

      // Update courses array - remove courses that are no longer in any roadmap
      const allCourses = new Set<number>();
      state.roadmaps.forEach((roadmap) => {
        (roadmap.courses || []).forEach((course) => {
          allCourses.add(+course.id);
        });
      });

      state.courses = sortByName(
        state.courses.filter((course) => allCourses.has(+course.id)),
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
          state.roadmaps = action.payload; // Already sorted in thunk

          // Update courses array with unique courses from all roadmaps
          const coursesMap = new Map<number, TCourse>();
          action.payload.forEach((roadmap) => {
            (roadmap.courses || []).forEach((course) => {
              coursesMap.set(+course.id, course);
            });
          });

          // Convert to array and sort alphabetically
          state.courses = sortByName(Array.from(coursesMap.values()));
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

const selectBaseRoadMap = (state: RootState) => state.roadmaps;

// Selectors
export const selectAllRoadmaps = createSelector(
  [selectBaseRoadMap],
  (data) => data.roadmaps ?? initialState.roadmaps,
);

export const selectRoadmapById = (roadmapId: number) =>
  createSelector([selectBaseRoadMap], (data): TRoadmap | undefined =>
    data.roadmaps.find((roadmap: TRoadmap) => roadmap.id === roadmapId),
  );

export const selectAllCourses = createSelector(
  [selectBaseRoadMap],
  (data) => data.courses ?? initialState.courses,
);
export const selectRoadmapsStatus = createSelector(
  [selectBaseRoadMap],
  (data) => data.status,
);
export const selectIsRoadmapsInitialized = createSelector(
  [selectBaseRoadMap],
  (data) => data.isInitialized,
);

export default roadmapsSlice.reducer;
