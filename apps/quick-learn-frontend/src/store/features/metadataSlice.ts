import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseAsyncState } from '../types/base.types';

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

export const { updateContentRepository } = metadataSlice.actions;

const metadataSelector = (state: RootState) => state.metadata;

export const selectMetadataStatus = createSelector([metadataSelector], data => data.status);

export const selectContentRepositoryMetadata = createSelector([metadataSelector], data => data?.metadata?.contentRepository || initialState.metadata.contentRepository)

export const selectIsMetadataInitialized = createSelector([metadataSelector], data => data.isInitialized);

export default metadataSlice.reducer;
