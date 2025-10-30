import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

/**
 * Memoized selectors for incidents
 * Prevents unnecessary re-renders
 */

// Base selectors
export const selectIncidentsState = (state: RootState) => state.incidents;
export const selectAllIncidents = (state: RootState) => state.incidents.data;
export const selectFilters = (state: RootState) => state.incidents.filters;
export const selectLoading = (state: RootState) => state.incidents.loading;
export const selectError = (state: RootState) => state.incidents.error;
export const selectConnected = (state: RootState) => state.incidents.connected;
export const selectLastUpdatedAt = (state: RootState) => state.incidents.lastUpdatedAt;
export const selectPage = (state: RootState) => state.incidents.page;
export const selectPageSize = (state: RootState) => state.incidents.pageSize;
export const selectTotal = (state: RootState) => state.incidents.total;
export const selectTotalPages = (state: RootState) => state.incidents.totalPages;
export const selectCountsBySeverity = (state: RootState) => state.incidents.countsBySeverity;
export const selectCountsByStatus = (state: RootState) => state.incidents.countsByStatus;

/**
 * Filtered incidents based on current filters
 * Memoized to prevent recalculation on every render
 */
// When server-side pagination/filtering is enabled, the API already returns filtered page data,
// so this selector just returns the page data directly.
export const selectFilteredIncidents = (state: RootState) => state.incidents.data;

/**
 * Get unique services from all incidents
 */
export const selectUniqueServices = createSelector(
  [selectAllIncidents],
  (incidents) => {
    const services = new Set(incidents.map((incident) => incident.service));
    return Array.from(services).sort();
  }
);

/**
 * Get incident counts by severity
 */
export const selectIncidentCountsBySeverity = (state: RootState) => selectCountsBySeverity(state);

/**
 * Get incident counts by status
 */
export const selectIncidentCountsByStatus = (state: RootState) => selectCountsByStatus(state);

/**
 * Get incidents sorted by creation date (newest first)
 */
export const selectIncidentsSortedByDate = createSelector(
  [selectFilteredIncidents],
  (incidents) => {
    return [...incidents].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
);

/**
 * Get critical and open incidents
 */
export const selectCriticalOpenIncidents = createSelector(
  [selectAllIncidents],
  (incidents) => {
    return incidents.filter(
      (incident) => incident.severity === 'critical' && incident.status !== 'resolved'
    );
  }
);

/**
 * Check if there are any active filters
 */
export const selectHasActiveFilters = createSelector(
  [selectFilters],
  (filters) => {
    return (
      filters.severity !== 'all' ||
      filters.service !== 'all' ||
      filters.status !== 'all' ||
      filters.searchQuery !== ''
    );
  }
);

