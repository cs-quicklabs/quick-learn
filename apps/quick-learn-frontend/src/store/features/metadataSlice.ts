// store/features/metadataSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContentRepositoryMetadata } from '@src/apiServices/contentRepositoryService';
import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface MetadataState {
  metadata: {
    contentRepository: TContentRepositoryMetadata;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
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
  async (_, { getState }) => {
    const state = getState() as RootState;

    // If already initialized and has data, skip the fetch
    if (
      state.metadata.isInitialized &&
      state.metadata.metadata.contentRepository.course_categories.length > 0
    ) {
      return state.metadata.metadata.contentRepository;
    }

    const response = await getContentRepositoryMetadata();
    return response.data;
  },
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadata.pending, (state) => {
        if (!state.isInitialized) {
          state.status = 'loading';
        }
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.metadata.contentRepository = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        if (!state.isInitialized) {
          state.status = 'failed';
        }
        state.error = action.error.message || null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const selectMetadataStatus = (state: RootState) => state.metadata.status;
export const selectContentRepositoryMetadata = (state: RootState) =>
  state.metadata.metadata.contentRepository;
export const selectIsMetadataInitialized = (state: RootState) =>
  state.metadata.isInitialized;

export default metadataSlice.reducer;
