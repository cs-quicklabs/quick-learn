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
  async () => {
    const response = await getContentRepositoryMetadata();
    return response.data;
  },
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setContentRepositoryMetadata: (
      state,
      action: PayloadAction<TContentRepositoryMetadata>,
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
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch metadata';
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { setContentRepositoryMetadata } = metadataSlice.actions;

// Selectors
export const selectMetadata = (state: RootState) => state.metadata.metadata;
export const selectContentRepository = (state: RootState) =>
  state.metadata.metadata.contentRepository;
export const selectMetadataStatus = (state: RootState) => state.metadata.status;

export default metadataSlice.reducer;
