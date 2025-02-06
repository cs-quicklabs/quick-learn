import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Import your reducers
import metadataReducer from './features/metadataSlice';
import dashboardReducer from './features/dashboardSlice';
import roadmapsReducer from './features/roadmapsSlice';
import uiReducer from './features/uiSlice';
import teamReducer from './features/teamSlice';
import approvalReducer from './features/approvalSlice';
import archivedReducer from './features/archivedSlice';
import userProgressReducer from './features/userProgressSlice';
import userReducer from './features/userSlice';
import systemPreferencesReducer from './features/systemPreferenceSlice';

// Configure persist for each reducer you want to persist
const dashboardPersistConfig = {
  key: 'dashboard',
  storage,
  // you can add additional persist configurations like blacklist/whitelist if needed
};

const userProgressPersistConfig = {
  key: 'userProgress',
  storage,
};

const metadataPersistConfig = {
  key: 'metadata',
  storage,
};

const systemPreferencesPersistConfig = {
  key: 'systemPreferences',
  storage,
};

// Create persisted reducers for the slices you want to persist
const persistedDashboardReducer = persistReducer(
  dashboardPersistConfig,
  dashboardReducer,
);
const persistedUserProgressReducer = persistReducer(
  userProgressPersistConfig,
  userProgressReducer,
);

const persistedMetadataReducer = persistReducer(
  metadataPersistConfig,
  metadataReducer,
);
const persistedSystemPreferencesReducer = persistReducer(
  systemPreferencesPersistConfig,
  systemPreferencesReducer,
);

export const store = configureStore({
  reducer: {
    user: userReducer,
    systemPreference: persistedSystemPreferencesReducer,
    metadata: persistedMetadataReducer, //persisted
    dashboard: persistedDashboardReducer, // persisted
    roadmaps: roadmapsReducer,
    ui: uiReducer,
    team: teamReducer,
    approval: approvalReducer,
    archived: archivedReducer,
    userProgress: persistedUserProgressReducer, // persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
