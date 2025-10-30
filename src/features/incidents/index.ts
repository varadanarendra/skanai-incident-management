/**
 * Public API for incidents feature
 * Export only what should be accessible from outside the feature
 */

// Components
export { IncidentList } from './components/IncidentList';
export { IncidentRow } from './components/IncidentRow';
export { FilterPanel } from './components/FilterPanel';
export { StatsSummary } from './components/StatsSummary';
export { IncidentTable } from './components/IncidentTable';
export { Pagination } from './components/Pagination';

// Hooks
export { useIncidents } from './hooks/useIncidents';
export { useIncidentsStream } from './hooks/useIncidentsStream';

// Types
export type { Incident, IncidentSeverity, IncidentStatus, IncidentFilters } from './types/Incident';

// Store (selectors only, actions should be used through hooks)
export {
  selectFilteredIncidents,
  selectAllIncidents,
  selectIncidentCountsBySeverity,
  selectIncidentCountsByStatus,
  selectUniqueServices,
} from './store/incidents.selectors';

