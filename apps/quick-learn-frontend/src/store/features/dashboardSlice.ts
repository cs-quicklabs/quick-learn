import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserRoadmapsService } from '@src/apiServices/contentRepositoryService';
import { TUserRoadmap, TUserCourse } from '@src/shared/types/contentRepository';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { showApiErrorInToast } from '@src/utils/toastUtils';

interface DashboardState {
  roadmaps: TUserRoadmap[];
  courses: TUserCourse[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}

const initialState: DashboardState = {
  roadmaps: [],
  courses: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

// Helper function to sort items alphabetically by name
const sortByName = <T extends { name?: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

const extractUniqueCourses = (roadmaps: TUserRoadmap[]): TUserCourse[] => {
  const allCourses = roadmaps.reduce<TUserCourse[]>((acc, roadmap) => {
    if (roadmap.courses) {
      return [...acc, ...roadmap.courses];
    }
    return acc;
  }, []);

  // Create a Map using number IDs
  const courseMap = new Map<number, TUserCourse>();
  allCourses.forEach((course) => {
    courseMap.set(course.id, course);
  });

  // Convert Map values to array and sort
  return sortByName(Array.from(courseMap.values()));
};

export const fetchDashboardData = createAsyncThunk<
  { roadmaps: TUserRoadmap[]; courses: TUserCourse[] },
  void,
  { rejectValue: string }
>('dashboard/fetchData', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserRoadmapsService();

    if (!response.success) {
      throw new Error('Failed to fetch user content');
    }

    const userRoadmaps = sortByName(response.data);
    const uniqueCourses = extractUniqueCourses(userRoadmaps);

    return {
      roadmaps: userRoadmaps,
      courses: uniqueCourses,
    };
  } catch (error) {
    showApiErrorInToast(error as AxiosErrorObject);
    return rejectWithValue(
      (error as Error).message || 'Failed to fetch dashboard data',
    );
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addRoadmap: (state, action) => {
      state.roadmaps.push(action.payload);
      state.roadmaps = sortByName(state.roadmaps);

      // Update courses array with new unique courses
      const newCourses: TUserCourse[] = action.payload.courses || [];
      newCourses.forEach((course) => {
        if (!state.courses.some((c) => c.id === course.id)) {
          state.courses.push(course);
        }
      });
      state.courses = sortByName(state.courses);
    },
    updateRoadmap: (state, action) => {
      const index = state.roadmaps.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.roadmaps[index] = action.payload;
        state.roadmaps = sortByName(state.roadmaps);

        // Update courses
        const updatedCourses: TUserCourse[] = action.payload.courses || [];
        updatedCourses.forEach((course) => {
          const courseIndex = state.courses.findIndex(
            (c) => c.id === course.id,
          );
          if (courseIndex === -1) {
            state.courses.push(course);
          } else {
            state.courses[courseIndex] = course;
          }
        });
        state.courses = sortByName(state.courses);
      }
    },
    removeRoadmap: (state, action) => {
      state.roadmaps = sortByName(
        state.roadmaps.filter((r) => r.id !== action.payload),
      );

      // Remove courses that are no longer in any roadmap
      const allCourses = new Set<number>();
      state.roadmaps.forEach((roadmap) => {
        (roadmap.courses || []).forEach((course) => {
          allCourses.add(course.id);
        });
      });

      state.courses = sortByName(
        state.courses.filter((course) => allCourses.has(course.id)),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roadmaps = action.payload.roadmaps;
        state.courses = action.payload.courses;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
        state.isInitialized = true;
      });
  },
});

export const { addRoadmap, updateRoadmap, removeRoadmap } =
  dashboardSlice.actions;

// Selectors
export const selectDashboardData = (state: RootState) => ({
  roadmaps: state.dashboard?.roadmaps || [],
  courses: state.dashboard?.courses || [],
  status: state.dashboard?.status || 'idle',
  error: state.dashboard?.error || null,
  isInitialized: state.dashboard?.isInitialized || false,
});

export default dashboardSlice.reducer;
