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
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
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
import flaggedReducer from './features/flaggedSlice';

// Function to create a no-op storage
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Check if localStorage is available
const storageAvailable =
  typeof window !== 'undefined' && window.localStorage
    ? createWebStorage('local')
    : createNoopStorage();

// Configure persist for each reducer you want to persist
const dashboardPersistConfig = {
  key: 'dashboard',
  storage: storageAvailable,
  // you can add additional persist configurations like blacklist/whitelist if needed
};

const userProgressPersistConfig = {
  key: 'userProgress',
  storage: storageAvailable,
};

const metadataPersistConfig = {
  key: 'metadata',
  storage: storageAvailable,
};

const systemPreferencesPersistConfig = {
  key: 'systemPreferences',
  storage: storageAvailable,
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

export const makeStore = () => {
  return configureStore({
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
      userProgress: persistedUserProgressReducer,
      flagged: flaggedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export const persistor = persistStore(makeStore());
export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
