import { REHYDRATE } from 'redux-persist';
import type { PersistedState } from 'redux-persist';
import { RootState } from '../types/base.types';
import { getSystemPreferences } from '../../apiServices/contentRepositoryService';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { SystemPreferences } from '@src/shared/types/contentRepository';

interface SystemPreferencesState {
  metadata: SystemPreferences;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the type for the rehydrate action payload
interface RehydrateAction {
  type: typeof REHYDRATE;
  key: string;
  payload?: {
    systemPreference?: SystemPreferencesState;
  } & PersistedState;
}

const initialState: SystemPreferencesState = {
  metadata: {
    unapproved_lessons: 0,
    flagged_lessons: 0,
  },
  status: 'idle',
  error: null,
};

export const fetchSystemPreferences = createAsyncThunk(
  'systemPreferences/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSystemPreferences();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

const systemPreferenceSlice = createSlice({
  name: 'systemPreferences',
  initialState,
  reducers: {
    updateSystemPreferencesData: (
      state,
      action: PayloadAction<Partial<SystemPreferences>>,
    ) => {
      state.metadata = { ...state.metadata, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE, (state, action: RehydrateAction) => {
        // Check if the rehydrate action is for this reducer
        if (action.payload?.systemPreference) {
          return {
            ...action.payload.systemPreference,
            status: 'idle',
          };
        }
        return state;
      })
      .addCase(fetchSystemPreferences.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSystemPreferences.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.metadata = payload.data;
      })
      .addCase(fetchSystemPreferences.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload as string;
      });
  },
});

export const { updateSystemPreferencesData } = systemPreferenceSlice.actions;
export default systemPreferenceSlice.reducer;

const baseSelector = (state: RootState) => state.systemPreference;

export const getSystemPreferencesState = createSelector(
  [baseSelector],
  (data) => ({
    metadata: data.metadata,
    status: data.status,
    error: data.error,
  }),
);
