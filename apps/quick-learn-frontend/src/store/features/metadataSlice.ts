import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { MetadataState } from '../types/metadata.types';
import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { RootState } from '../store';

const initialState: MetadataState = {
  metadata: {
    contentRepository: {
      roadmap_categories: [],
      course_categories: [],
    },
  },
  status: 'idle',
  error: null,
};

export const fetchMetadata = createAsyncThunk(
  'metadata/fetchMetadata',
  async (_, { getState }) => {
    const state = getState() as { metadata: MetadataState };

    // If data is already loaded and we have categories, return existing data
    if (
      state.metadata.status === 'succeeded' &&
      state.metadata.metadata.contentRepository.course_categories.length > 0
    ) {
      return state.metadata.metadata.contentRepository;
    }

    const response = await getContentRepositoryMetadata();
    return response.data;
  },
  {
    // Prevent multiple simultaneous requests
    condition: (_, { getState }) => {
      const state = getState() as { metadata: MetadataState };
      const status = state.metadata.status;

      // If the data is already being fetched, don't fetch again
      if (status === 'loading') {
        return false;
      }
      return true;
    },
  },
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    resetMetadataStatus: (state) => {
      state.status = 'idle';
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
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch metadata';
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { resetMetadataStatus } = metadataSlice.actions;

// Selectors
export const selectMetadata = (state: RootState) => state.metadata.metadata;
export const selectContentRepositoryMetadata = (state: RootState) =>
  state.metadata.metadata.contentRepository;
export const selectMetadataStatus = (state: RootState) => state.metadata.status;

export default metadataSlice.reducer;
