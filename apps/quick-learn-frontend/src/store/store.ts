// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './features/metadataSlice';
import roadmapsReducer from './features/roadmapsSlice';
import learningPathReducer from './features/learningPathSlice';
import uiReducer from './features/uiSlice';
import teamReducer from './features/teamSlice';
import approvalReducer from './features/approvalSlice';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    roadmaps: roadmapsReducer,
    learningPath: learningPathReducer,
    ui: uiReducer,
    team: teamReducer,
    approval: approvalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
