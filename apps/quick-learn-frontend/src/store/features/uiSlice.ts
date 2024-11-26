// store/features/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

// Selectors
export const selectHideNavbar = (state: RootState) => state.ui.hideNavbar;

export default uiSlice.reducer;
