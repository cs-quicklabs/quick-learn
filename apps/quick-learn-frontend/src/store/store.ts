import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './features/metadataSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    ui: uiReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {metadata: MetadataState, ui: UIState}
export type AppDispatch = typeof store.dispatch;
