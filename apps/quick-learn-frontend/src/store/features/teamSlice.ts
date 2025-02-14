// store/features/teamSlice.ts
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { teamListApiCall } from '@src/apiServices/teamService';
import { en } from '@src/constants/lang/en';
import { TUser } from '@src/shared/types/userTypes';
import { BaseLoadingState, RootState } from '../types/base.types';

interface TeamState extends BaseLoadingState {
  users: TUser[];
  totalUsers: number;
  filteredTotal: number;
  totalPages: number;
  currentPage: number;
  currentUserType: string;
  searchQuery: string;
}

const initialState: TeamState = {
  users: [],
  totalUsers: 0,
  filteredTotal: 0,
  isLoading: true,
  isInitialLoad: true, // Track initial load
  error: null,
  currentPage: 1,
  currentUserType: '',
  searchQuery: '',
  totalPages: 0,
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async ({
    page,
    userTypeCode,
    query,
  }: {
    page: number;
    userTypeCode?: string;
    query?: string;
  }) => {
    const response = await teamListApiCall(page, userTypeCode, query);
    return response.data;
  },
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCurrentUserType: (state, action) => {
      state.currentUserType = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    decrementTotalUsers: (state) => {
      state.totalUsers -= 1;
      state.filteredTotal -= 1;
    },
    increamentTotalUsers: (state) => {
      state.totalUsers += 1;
      state.filteredTotal += 1;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload?.items || [];
        state.filteredTotal = action.payload?.total || 0;
        state.totalPages = action.payload?.total_pages || 0;

        if (state.isInitialLoad || state.totalUsers < state.filteredTotal) {
          state.totalUsers = state.filteredTotal;
          state.searchQuery = '';
          state.currentUserType = '';
        }

        state.isInitialLoad = false;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false; // Set to false even on error
        state.error = action.error.message || en.common.anErrorOccurred;
      });
  },
});

export const {
  setCurrentPage,
  setCurrentUserType,
  setSearchQuery,
  decrementTotalUsers,
  increamentTotalUsers,
} = teamSlice.actions;

// Base selector
const selectTeam = (state: RootState) => state.team;

export const selectTeamListingData = createSelector([selectTeam], (data) => ({
  users: data.users,
  totalUsers: data.totalUsers,
  filteredTotal: data.filteredTotal,
  isLoading: data.isLoading,
  isInitialLoad: data.isInitialLoad,
  error: data.error,
  currentPage: data.currentPage,
  currentUserType: data.currentUserType,
  searchQuery: data.searchQuery,
  totalPages: data.totalPages,
}));

export default teamSlice.reducer;
