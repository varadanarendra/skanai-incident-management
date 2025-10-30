import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchIncidents } from '../store/incidents.thunks';
import {
  selectFilteredIncidents,
  selectLoading,
  selectError,
  selectConnected,
  selectIncidentCountsBySeverity,
  selectIncidentCountsByStatus,
  selectUniqueServices,
  selectHasActiveFilters,
  selectPage,
  selectPageSize,
  selectTotal,
  selectTotalPages,
} from '../store/incidents.selectors';
import { setFilters, resetFilters, setPage, setPageSize } from '../store/incidents.slice';
import { IncidentFilters } from '../types/Incident';

/**
 * Custom hook to manage incidents data and operations
 * Provides a clean API for components to interact with incidents
 */
export const useIncidents = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const incidents = useAppSelector(selectFilteredIncidents);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const connected = useAppSelector(selectConnected);
  const severityCounts = useAppSelector(selectIncidentCountsBySeverity);
  const statusCounts = useAppSelector(selectIncidentCountsByStatus);
  const services = useAppSelector(selectUniqueServices);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  // Pagination state
  const page = useAppSelector(selectPage);
  const pageSize = useAppSelector(selectPageSize);
  const total = useAppSelector(selectTotal);
  const totalPages = useAppSelector(selectTotalPages);

  // Load incidents on mount and whenever filters/pagination change
  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch, page, pageSize, hasActiveFilters]);

  // Actions
  const updateFilters = (filters: Partial<IncidentFilters>) => {
    dispatch(setFilters(filters));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  const refresh = () => {
    dispatch(fetchIncidents());
  };

  const changePage = (nextPage: number) => {
    dispatch(setPage(nextPage));
  };

  const changePageSize = (nextSize: number) => {
    dispatch(setPageSize(nextSize));
  };

  return {
    incidents,
    loading,
    error,
    connected,
    severityCounts,
    statusCounts,
    services,
    hasActiveFilters,
    page,
    pageSize,
    total,
    totalPages,
    updateFilters,
    clearFilters,
    refresh,
    changePage,
    changePageSize,
  };
};

