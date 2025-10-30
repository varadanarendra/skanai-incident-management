import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

/**
 * Redux Store configuration
 * Configured with Redux Toolkit for optimal defaults
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['incidents/setLastUpdatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['incidents.lastUpdatedAt'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

