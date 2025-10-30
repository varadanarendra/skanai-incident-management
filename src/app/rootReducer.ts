import { combineReducers } from '@reduxjs/toolkit';
import incidentsReducer from '@/features/incidents/store/incidents.slice';

/**
 * Root reducer - combines all feature slices
 * Add new feature reducers here as they are created
 */
const rootReducer = combineReducers({
  incidents: incidentsReducer,
  // Add more feature reducers here
  // users: usersReducer,
  // notifications: notificationsReducer,
});

export default rootReducer;

