// store/features/roadmapsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoadmaps } from '@src/apiServices/contentRepositoryService';
import { TRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';

interface RoadmapsState {
  roadmaps: TRoadmap[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isInitialized: boolean;
}

const initialState: RoadmapsState = {
  roadmaps: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const fetchRoadmaps = createAsyncThunk(
  'roadmaps/fetchRoadmaps',
  async (_, { getState }) => {
    const state = getState() as RootState;

    // If already initialized and has data, skip the fetch
    if (state.roadmaps.isInitialized && state.roadmaps.roadmaps.length > 0) {
      return state.roadmaps.roadmaps;
    }

    const response = await getRoadmaps();
    return response.data;
  },
);

const roadmapsSlice = createSlice({
  name: 'roadmaps',
  initialState,
  reducers: {
    addRoadmap: (state, action) => {
      state.roadmaps.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmaps.pending, (state) => {
        if (!state.isInitialized) {
          state.status = 'loading';
        }
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roadmaps = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        if (!state.isInitialized) {
          state.status = 'failed';
        }
        state.error = action.error.message || null;
        showApiErrorInToast(action.error as AxiosErrorObject);
      });
  },
});

export const { addRoadmap } = roadmapsSlice.actions;

export const selectAllRoadmaps = (state: RootState) => state.roadmaps.roadmaps;
export const selectRoadmapsStatus = (state: RootState) => state.roadmaps.status;
export const selectIsRoadmapsInitialized = (state: RootState) =>
  state.roadmaps.isInitialized;

export default roadmapsSlice.reducer;
