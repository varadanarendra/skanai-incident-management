/**
 * Incident domain types
 */

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  service: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface IncidentFilters {
  severity: IncidentSeverity | 'all';
  service: string | 'all';
  status: IncidentStatus | 'all';
  searchQuery: string;
}

export interface IncidentsState {
  data: Incident[];
  filters: IncidentFilters;
  loading: boolean;
  error: string | null;
  lastUpdatedAt: number | null;
  connected: boolean;
  // Pagination
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  // Global aggregates for filtered set
  countsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  countsByStatus: {
    open: number;
    investigating: number;
    resolved: number;
    total: number;
  };
}

// WebSocket message types
export type WebSocketMessageType = 'incident.created' | 'incident.updated' | 'incident.resolved';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: Incident;
}

