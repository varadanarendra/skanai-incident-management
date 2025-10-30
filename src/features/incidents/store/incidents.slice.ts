import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Incident, IncidentsState, IncidentFilters } from '../types/Incident';
import { fetchIncidents } from './incidents.thunks';

/**
 * Incidents Redux Slice
 * Manages all incident-related state
 */

const initialState: IncidentsState = {
  data: [],
  filters: {
    severity: 'all',
    service: 'all',
    status: 'all',
    searchQuery: '',
  },
  loading: false,
  error: null,
  lastUpdatedAt: null,
  connected: false,
  page: 1,
  pageSize: 25,
  total: 0,
  totalPages: 1,
  countsBySeverity: { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
  countsByStatus: { open: 0, investigating: 0, resolved: 0, total: 0 },
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    /**
     * Upsert incident - adds new or updates existing
     * Used for real-time updates via WebSocket
     */
    upsertIncident: (state, action: PayloadAction<Incident>) => {
      const index = state.data.findIndex((incident) => incident.id === action.payload.id);
      
      if (index !== -1) {
        // Update existing incident
        state.data[index] = action.payload;
      } else {
        // Add new incident
        state.data.unshift(action.payload);
      }
      
      state.lastUpdatedAt = Date.now();
    },

    /**
     * Remove incident by ID
     */
    removeIncident: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((incident) => incident.id !== action.payload);
      state.lastUpdatedAt = Date.now();
    },

    /**
     * Set all incidents (used for initial load)
     */
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.data = action.payload;
      state.lastUpdatedAt = Date.now();
    },

    /**
     * Update filters
     */
    setFilters: (state, action: PayloadAction<Partial<IncidentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page on filter change
      state.page = 1;
    },

    /**
     * Reset filters to default
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    /**
     * Set WebSocket connection status
     */
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Pagination controls
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.page = Math.max(action.payload, 1);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = Math.max(action.payload, 1);
      state.page = 1; // reset to first page when page size changes
    },

    /**
     * Clear all incidents
     */
    clearIncidents: (state) => {
      state.data = [];
      state.lastUpdatedAt = null;
    },
  },

  // Handle async thunks
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.page = action.payload.page;
        state.pageSize = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.countsBySeverity = action.payload.countsBySeverity;
        state.countsByStatus = action.payload.countsByStatus;
        state.lastUpdatedAt = Date.now();
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  upsertIncident,
  removeIncident,
  setIncidents,
  setFilters,
  resetFilters,
  setConnectionStatus,
  setLoading,
  setError,
  setPage,
  setPageSize,
  clearIncidents,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;

