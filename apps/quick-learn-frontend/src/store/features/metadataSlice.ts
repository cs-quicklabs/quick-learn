import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { BaseAsyncState, RootState } from '../types/base.types';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import {
  TContentRepositoryMetadata,
  TCourse,
  TRoadmap,
} from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface MetadataState extends BaseAsyncState {
  metadata: {
    contentRepository: TContentRepositoryMetadata;
  };
}

const initialState: MetadataState = {
  metadata: {
    contentRepository: {
      roadmap_categories: [],
      course_categories: [],
    },
  },
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const fetchMetadata = createAsyncThunk(
  'metadata/fetchMetadata',
  async () => {
    const response = await getContentRepositoryMetadata();
    return response.data;
  },
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    updateContentRepository: (
      state,
      action: PayloadAction<Partial<TContentRepositoryMetadata>>,
    ) => {
      state.metadata.contentRepository = {
        ...state.metadata.contentRepository,
        ...action.payload,
      };
      state.isInitialized = true;
    },
    updateContentRepositoryRoadmap: (
      state,
      action: PayloadAction<TRoadmap>,
    ) => {
      const roadmap = action.payload;
      const roadmap_category =
        state.metadata.contentRepository.roadmap_categories.find(
          (category) => category.id === +roadmap.roadmap_category_id,
        );
      if (!roadmap_category) return;
      roadmap_category.roadmaps = [...roadmap_category.roadmaps, roadmap];
    },
    updateContentRepositoryCourse: (state, action: PayloadAction<TCourse>) => {
      const course = action.payload;
      const course_category =
        state.metadata.contentRepository.course_categories.find(
          (category) => category.id === +course.course_category_id,
        );
      if (!course_category) return;

      const formattedCourse = {
        id: course.id,
        name: course.name,
        description: course.description,
        course_category_id: course.course_category_id,
        archived: course.archived,
        is_community_available: course.is_community_available,
        created_by_user_id: course.created_by_user_id,
        updated_by_id: course.updated_by?.id,
        created_at: course.created_at,
        updated_at: course.updated_at,
        lessons_count: course.lessons_count ?? 0, // Default to 0 if missing
        roadmaps_count: course.roadmaps ? course.roadmaps.length : 0, // Count roadmaps
      };
      course_category.courses = [...course_category.courses, formattedCourse];
    },
    updateContentRepositoryRoadmapCount: (
      state,
      action: PayloadAction<{ id: string; action: number }[]>,
    ) => {
      const updates = action.payload;
      if (!updates) return;
      updates.forEach(({ id, action }) => {
        state.metadata.contentRepository.course_categories.forEach(
          (category) => {
            const course = category.courses.find(
              (course) => String(course.id) === id,
            );
            if (!course) return;

            if (action >= 1) {
              course.roadmaps_count = (course.roadmaps_count ?? 0) + action; // Increment count
            } else if (action <= 0) {
              course.roadmaps_count = Math.max(
                (course.roadmaps_count ?? 0) + action,
                0,
              ); // Decrement but not below 0
            }
          },
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadata.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.metadata.contentRepository = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const {
  updateContentRepository,
  updateContentRepositoryRoadmap,
  updateContentRepositoryCourse,
  updateContentRepositoryRoadmapCount,
} = metadataSlice.actions;

const metadataSelector = (state: RootState) => state.metadata;

export const selectMetadataStatus = createSelector(
  [metadataSelector],
  (data) => data.status,
);

export const selectContentRepositoryMetadata = createSelector(
  [metadataSelector],
  (data) =>
    data?.metadata?.contentRepository ||
    initialState.metadata.contentRepository,
);

export const selectIsMetadataInitialized = createSelector(
  [metadataSelector],
  (data) => data.isInitialized,
);

export const selectContentRepositoryCourseCategory = createSelector(
  [metadataSelector],
  (data) => data?.metadata?.contentRepository.course_categories,
);

export default metadataSlice.reducer;
