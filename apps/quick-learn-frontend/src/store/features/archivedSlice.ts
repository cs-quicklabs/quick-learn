import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import {
  TRoadmap,
  TCourse,
  TLesson,
} from '@src/shared/types/contentRepository';
import * as archivedService from '@src/apiServices/archivedService';
import { TUser } from '@src/shared/types/userTypes';
import {
  createInitialPaginatedState,
  PaginatedCollectionState,
  RootState,
} from '../types/base.types';

export interface ArchivedState {
  users: PaginatedCollectionState<TUser>;
  roadmaps: PaginatedCollectionState<TRoadmap>;
  courses: PaginatedCollectionState<TCourse>;
  lessons: PaginatedCollectionState<TLesson>;
}

export const initialState: ArchivedState = {
  users: createInitialPaginatedState<TUser>(),
  roadmaps: createInitialPaginatedState<TRoadmap>(),
  courses: createInitialPaginatedState<TCourse>(),
  lessons: createInitialPaginatedState<TLesson>(),
};
// Users Thunks
export const fetchArchivedUsers = createAsyncThunk(
  'archived/fetchUsers',
  async ({
    page,
    search,
    resetList = false,
  }: {
    page: number;
    search: string;
    resetList?: boolean;
  }) => {
    const response = await archivedService.getArchivedUsers(page, search);
    return { data: response.data, resetList };
  },
);

export const activateArchivedUser = createAsyncThunk(
  'archived/activateUser',
  async ({ userId }: { userId: number }) => {
    await archivedService.activateUser({ active: true, userId });
    return userId;
  },
);

export const deleteArchivedUser = createAsyncThunk(
  'archived/deleteUser',
  async ({ userId }: { userId: number }) => {
    await archivedService.deleteUser(userId);
    return userId;
  },
);

// Roadmaps Thunks
export const fetchArchivedRoadmaps = createAsyncThunk(
  'archived/fetchRoadmaps',
  async ({
    page,
    search,
    resetList = false,
  }: {
    page: number;
    search: string;
    resetList?: boolean;
  }) => {
    const response = await archivedService.getArchivedRoadmaps(page, search);
    return { data: response.data, resetList };
  },
);

export const activateArchivedRoadmap = createAsyncThunk(
  'archived/activateRoadmap',
  async ({ id }: { id: number }) => {
    await archivedService.activateRoadmap({ active: true, id });
    return id;
  },
);

export const deleteArchivedRoadmap = createAsyncThunk(
  'archived/deleteRoadmap',
  async ({ id }: { id: number }) => {
    await archivedService.deleteRoadmap(id);
    return id;
  },
);

// Courses Thunks
export const fetchArchivedCourses = createAsyncThunk(
  'archived/fetchCourses',
  async ({
    page,
    search,
    resetList = false,
  }: {
    page: number;
    search: string;
    resetList?: boolean;
  }) => {
    const response = await archivedService.getArchivedCourses(page, search);
    return { data: response.data, resetList };
  },
);

export const activateArchivedCourse = createAsyncThunk(
  'archived/activateCourse',
  async ({ id }: { id: number }) => {
    await archivedService.activateCourse({ active: true, id });
    return id;
  },
);

export const deleteArchivedCourse = createAsyncThunk(
  'archived/deleteCourse',
  async ({ id }: { id: number }) => {
    await archivedService.deleteCourse(id);
    return id;
  },
);

// Lessons Thunks
export const fetchArchivedLessons = createAsyncThunk(
  'archived/fetchLessons',
  async ({
    page,
    search,
    resetList = false,
  }: {
    page: number;
    search: string;
    resetList?: boolean;
  }) => {
    const response = await archivedService.getArchivedLessons(page, search);
    return { data: response.data, resetList };
  },
);

export const activateArchivedLesson = createAsyncThunk(
  'archived/activateLesson',
  async ({ id }: { id: number }) => {
    await archivedService.activateLesson({ active: true, id });
    return id;
  },
);

export const deleteArchivedLesson = createAsyncThunk(
  'archived/deleteLesson',
  async ({ id }: { id: number }) => {
    await archivedService.deleteLesson(id);
    return id;
  },
);

const archivedSlice = createSlice({
  name: 'archived',
  initialState,
  reducers: {
    setUsersSearchValue: (state, action: PayloadAction<string>) => {
      state.users.searchValue = action.payload;
    },
    resetUsersState: (state) => {
      state.users = initialState.users;
    },
    setRoadmapsSearchValue: (state, action: PayloadAction<string>) => {
      state.roadmaps.searchValue = action.payload;
    },
    resetRoadmapsState: (state) => {
      state.roadmaps = initialState.roadmaps;
    },
    setCoursesSearchValue: (state, action: PayloadAction<string>) => {
      state.courses.searchValue = action.payload;
    },
    resetCoursesState: (state) => {
      state.courses = initialState.courses;
    },
    setLessonsSearchValue: (state, action: PayloadAction<string>) => {
      state.lessons.searchValue = action.payload;
    },
    resetLessonsState: (state) => {
      state.lessons = initialState.lessons;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users reducers
      .addCase(fetchArchivedUsers.pending, (state) => {
        state.users.isLoading = true;
      })
      .addCase(fetchArchivedUsers.fulfilled, (state, action) => {
        const { data, resetList } = action.payload;
        if (resetList) {
          state.users.items = data.items;
        } else {
          state.users.items = [...state.users.items, ...data.items];
        }
        state.users.page = data.page + 1;
        state.users.hasMore =
          Boolean(data.total_pages) && data.page !== data.total_pages;
        state.users.isLoading = false;
        state.users.isInitialLoad = false;
      })
      .addCase(fetchArchivedUsers.rejected, (state) => {
        state.users.isLoading = false;
        state.users.isInitialLoad = false;
      })

      // Roadmaps reducers
      .addCase(fetchArchivedRoadmaps.pending, (state) => {
        state.roadmaps.isLoading = true;
      })
      .addCase(fetchArchivedRoadmaps.fulfilled, (state, action) => {
        const { data, resetList } = action.payload;
        if (resetList) {
          state.roadmaps.items = data.items;
        } else {
          state.roadmaps.items = [...state.roadmaps.items, ...data.items];
        }
        state.roadmaps.page = data.page + 1;
        state.roadmaps.hasMore = data.page < data.total_pages;
        state.roadmaps.isLoading = false;
        state.roadmaps.isInitialLoad = false;
      })
      .addCase(fetchArchivedRoadmaps.rejected, (state) => {
        state.roadmaps.isLoading = false;
        state.roadmaps.isInitialLoad = false;
      })

      // Courses reducers
      .addCase(fetchArchivedCourses.pending, (state) => {
        state.courses.isLoading = true;
      })
      .addCase(fetchArchivedCourses.fulfilled, (state, action) => {
        const { data, resetList } = action.payload;
        if (resetList) {
          state.courses.items = data.items;
        } else {
          state.courses.items = [...state.courses.items, ...data.items];
        }
        state.courses.page = data.page + 1;
        state.courses.hasMore =
          Boolean(data.total_pages) && data.page !== data.total_pages;
        state.courses.isLoading = false;
        state.courses.isInitialLoad = false;
      })
      .addCase(fetchArchivedCourses.rejected, (state) => {
        state.courses.isLoading = false;
        state.courses.isInitialLoad = false;
      })

      // Lessons reducers
      .addCase(fetchArchivedLessons.pending, (state) => {
        state.lessons.isLoading = true;
      })
      .addCase(fetchArchivedLessons.fulfilled, (state, action) => {
        const { data, resetList } = action.payload;
        if (resetList) {
          state.lessons.items = data.items;
        } else {
          state.lessons.items = [...state.lessons.items, ...data.items];
        }
        state.lessons.page = data.page + 1;
        state.lessons.hasMore = data.page < data.total_pages;
        state.lessons.isLoading = false;
        state.lessons.isInitialLoad = false;
      })
      .addCase(fetchArchivedLessons.rejected, (state) => {
        state.lessons.isLoading = false;
        state.lessons.isInitialLoad = false;
      });
  },
});

// Selectors
const baseArchivedSelector = (state: RootState) => state.archived;

export const selectArchivedUsers = createSelector(
  [baseArchivedSelector],
  (data) => data.users,
);
export const selectArchivedRoadmaps = createSelector(
  [baseArchivedSelector],
  (data) => data.roadmaps,
);
export const selectArchivedCourses = createSelector(
  [baseArchivedSelector],
  (data) => data.courses,
);
export const selectArchivedLessons = createSelector(
  [baseArchivedSelector],
  (data) => data.lessons,
);

export const {
  setUsersSearchValue,
  resetUsersState,
  setRoadmapsSearchValue,
  resetRoadmapsState,
  setCoursesSearchValue,
  resetCoursesState,
  setLessonsSearchValue,
  resetLessonsState,
} = archivedSlice.actions;

export default archivedSlice.reducer;
