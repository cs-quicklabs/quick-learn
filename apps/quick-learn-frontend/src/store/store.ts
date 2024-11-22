// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './features/metadataSlice';
import roadmapsReducer from './features/roadmapsSlice';
import learningPathReducer from './features/learningPathSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    roadmaps: roadmapsReducer,
    learningPath: learningPathReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
