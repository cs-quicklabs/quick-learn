// store/features/uiSlice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types/metadata.types';
import { RootState } from '../store';

const initialState: UIState = {
  hideNavbar: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setHideNavbar: (state, action: PayloadAction<boolean>) => {
      state.hideNavbar = action.payload;
    },
  },
});

export const { setHideNavbar } = uiSlice.actions;

const baseSelector = (state: RootState) => state.ui;

// Selectors
export const selectHideNavbar = createSelector([baseSelector], data => data.hideNavbar);

export default uiSlice.reducer;
