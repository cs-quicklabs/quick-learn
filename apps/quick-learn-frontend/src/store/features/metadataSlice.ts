import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { BaseAsyncState, RootState } from '../types/base.types';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';
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

            if (action === 1) {
              course.roadmaps_count = (course.roadmaps_count || 0) + 1; // Increment count
            } else if (action === -1) {
              course.roadmaps_count = Math.max(
                (course.roadmaps_count || 0) - 1,
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
        state.error = action.error.message || null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { updateContentRepository, updateContentRepositoryRoadmapCount } =
  metadataSlice.actions;

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

export default metadataSlice.reducer;
