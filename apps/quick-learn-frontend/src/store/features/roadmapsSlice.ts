// store/features/roadmapsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoadmaps } from '@src/apiServices/contentRepositoryService';
import { TRoadmap } from '@src/shared/types/contentRepository';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { RootState } from '../store';
import { AxiosErrorObject } from '@src/apiServices/axios';
import { BaseAsyncState } from '../types/base.types';

interface RoadmapsState extends BaseAsyncState {
  roadmaps: TRoadmap[];
}

const initialState: RoadmapsState = {
  roadmaps: [],
  status: 'idle',
  error: null,
  isInitialized: false,
};

export const fetchRoadmaps = createAsyncThunk(
  'roadmaps/fetchRoadmaps',
  async () => {
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
        state.status = 'loading';
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roadmaps = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.status = 'failed';
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
