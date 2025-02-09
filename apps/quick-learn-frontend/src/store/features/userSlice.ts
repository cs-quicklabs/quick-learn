import { RootState } from '../types/base.types';
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { getUser } from '@src/apiServices/authService';
import { TUser } from '@src/shared/types/userTypes';

interface UserState {
  user: TUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUser();
      if (!response.data) {
        return rejectWithValue('No user data received');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Failed to fetch user',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch user';
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

const baseSelector = (state: RootState) => state.user;

export const selectUser = createSelector(
  [baseSelector],
  (data) => data?.user || null,
);
export const selectUserStatus = createSelector(
  [baseSelector],
  (data) => data.status,
);
export const selectUserError = createSelector(
  [baseSelector],
  (data) => data.error,
);
