import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getSystemPreferences } from '@src/apiServices/contentRepositoryService';

export type SystemPreferences = {
  unapprovedLessons: number;
};

interface SystemPreferencesState {
  metadata: SystemPreferences;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const INITIAL_STATE: SystemPreferencesState = {
  metadata: {
    unapprovedLessons: 0,
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
  initialState: INITIAL_STATE,
  reducers: {
    resetSystemPreferences: () => INITIAL_STATE,
    decrementUnapprovedLessons: (state) => {
      if (state.metadata.unapprovedLessons > 0) {
        state.metadata.unapprovedLessons -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { resetSystemPreferences, decrementUnapprovedLessons } =
  systemPreferenceSlice.actions;
export default systemPreferenceSlice.reducer;

export const getUnapprovedLessonCount = (state: RootState) =>
  state?.systemPreference?.metadata?.unapprovedLessons;
