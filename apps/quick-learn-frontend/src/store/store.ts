import { configureStore } from '@reduxjs/toolkit';
import metadataReducer from './features/metadataSlice';
import dashboardReducer from './features/dashboardSlice';
import roadmapsReducer from './features/roadmapsSlice';
import uiReducer from './features/uiSlice';
import teamReducer from './features/teamSlice';
import approvalReducer from './features/approvalSlice';
import archivedReducer from './features/archivedSlice';
import userProgressReducer from './features/userProgressSlice';

export const store = configureStore({
  reducer: {
    metadata: metadataReducer,
    dashboard: dashboardReducer,
    roadmaps: roadmapsReducer,
    ui: uiReducer,
    team: teamReducer,
    approval: approvalReducer,
    archived: archivedReducer,
    userProgress: userProgressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
