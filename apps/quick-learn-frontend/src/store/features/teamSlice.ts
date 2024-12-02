// store/features/teamSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamListApiCall } from '@src/apiServices/teamService';
import { en } from '@src/constants/lang/en';
import { TUser } from '@src/shared/types/userTypes';

interface TeamState {
  users: TUser[];
  totalUsers: number;
  filterdTotal: number;
  isLoading: boolean;
  isInitialLoad: boolean; // New flag for initial load
  error: string | null;
  currentPage: number;
  currentUserType: string;
  searchQuery: string;
}

const initialState: TeamState = {
  users: [],
  totalUsers: 0,
  filterdTotal: 0,
  isLoading: true,
  isInitialLoad: true, // Track initial load
  error: null,
  currentPage: 1,
  currentUserType: '',
  searchQuery: '',
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async ({
    page,
    userTypeCode,
    query,
  }: {
    page: number;
    userTypeCode: string;
    query: string;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.items;
        if (
          state.filterdTotal > state.totalUsers ||
          (state.searchQuery === '' && state.currentUserType === '')
        ) {
          state.totalUsers = state.filterdTotal; // Only set the totalUsers once on initial load
          state.searchQuery = '';
          state.currentUserType = '';
        }
        state.isInitialLoad = false; // Set to false after first successful load
        state.filterdTotal = action.payload.total;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialLoad = false; // Set to false even on error
        state.error = action.error.message || en.common.anErrorOccurred;
      });
  },
});

export const { setCurrentPage, setCurrentUserType, setSearchQuery } =
  teamSlice.actions;
export default teamSlice.reducer;
