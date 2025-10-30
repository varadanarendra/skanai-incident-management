import { createAsyncThunk } from '@reduxjs/toolkit';
import { incidentsApi } from '../services/incidents.api';
import { Incident } from '../types/Incident';
import { RootState } from '@/app/store';

/**
 * Async thunks for incident operations
 * Handles side effects and API calls
 */

export const fetchIncidents = createAsyncThunk<
  {
    data: Incident[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    countsBySeverity: { critical: number; high: number; medium: number; low: number; total: number };
    countsByStatus: { open: number; investigating: number; resolved: number; total: number };
  },
  void,
  { state: RootState; rejectValue: string }
>(
  'incidents/fetchIncidents',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { page, pageSize, filters } = state.incidents;
      const response = await incidentsApi.getAll({
        page,
        limit: pageSize,
        search: filters.searchQuery,
        severity: filters.severity !== 'all' ? filters.severity : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        service: filters.service !== 'all' ? filters.service : undefined,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch incidents');
    }
  }
);

export const createIncident = createAsyncThunk<
  Incident,
  Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('incidents/createIncident', async (incidentData, { rejectWithValue }) => {
  try {
    const incident = await incidentsApi.create(incidentData);
    return incident;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create incident');
  }
});

export const updateIncident = createAsyncThunk<
  Incident,
  { id: string; updates: Partial<Incident> },
  { rejectValue: string }
>('incidents/updateIncident', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const incident = await incidentsApi.update(id, updates);
    return incident;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update incident');
  }
});

export const resolveIncident = createAsyncThunk<
  Incident,
  string,
  { rejectValue: string }
>('incidents/resolveIncident', async (id, { rejectWithValue }) => {
  try {
    const incident = await incidentsApi.resolve(id);
    return incident;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to resolve incident');
  }
});

export const deleteIncident = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('incidents/deleteIncident', async (id, { rejectWithValue }) => {
  try {
    await incidentsApi.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete incident');
  }
});

