import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { selectFilters } from '../store/incidents.selectors';
import { IncidentSeverity, IncidentStatus } from '../types/Incident';

interface FilterPanelProps {
  services: string[];
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  variant?: 'panel' | 'inline';
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  services,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  variant = 'panel',
}) => {
  const { t } = useTranslation();
  const filters = useAppSelector(selectFilters);

  const severities: (IncidentSeverity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];
  const statuses: (IncidentStatus | 'all')[] = ['all', 'open', 'investigating', 'resolved'];

  if (variant === 'inline') {
    return (
      <div className="w-full" role="search" aria-label="Filter incidents">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="flex flex-col">
            <label htmlFor="search" className="sr-only">
              {t('incidents.filters.search')}
            </label>
            <input
              id="search"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder={t('incidents.filters.searchPlaceholder')}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('incidents.filters.search')}
            />
          </div>

          {/* Severity */}
          <div className="flex flex-col">
            <label htmlFor="severity" className="sr-only">
              {t('incidents.filters.severity')}
            </label>
            <select
              id="severity"
              value={filters.severity}
              onChange={(e) => onFilterChange({ severity: e.target.value })}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('incidents.filters.severity')}
            >
              {severities.map((severity) => (
                <option key={severity} value={severity}>
                  {t(`incidents.filters.${severity}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="sr-only">
              {t('incidents.filters.status')}
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('incidents.filters.status')}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {t(`incidents.filters.${status}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div className="flex flex-col">
            <label htmlFor="service" className="sr-only">
              {t('incidents.filters.service')}
            </label>
            <select
              id="service"
              value={filters.service}
              onChange={(e) => onFilterChange({ service: e.target.value })}
              className="w-56 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('incidents.filters.service')}
            >
              <option value="all">{t('incidents.filters.allServices')}</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Clear */}
          <div className="flex items-center h-10">
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
              aria-label={t('incidents.filters.clearAll')}
              disabled={!hasActiveFilters}
            >
              {t('incidents.filters.clearAll')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6" role="search" aria-label="Filter incidents">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('incidents.filters.title')}</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            aria-label={t('incidents.filters.clearAll')}
          >
            {t('incidents.filters.clearAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            {t('incidents.filters.search')}
          </label>
          <input
            id="search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder={t('incidents.filters.searchPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('incidents.filters.search')}
          />
        </div>

        {/* Severity Filter */}
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            {t('incidents.filters.severity')}
          </label>
          <select
            id="severity"
            value={filters.severity}
            onChange={(e) => onFilterChange({ severity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('incidents.filters.severity')}
          >
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {t(`incidents.filters.${severity}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            {t('incidents.filters.status')}
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('incidents.filters.status')}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {t(`incidents.filters.${status}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div className="md:col-span-2">
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            {t('incidents.filters.service')}
          </label>
          <select
            id="service"
            value={filters.service}
            onChange={(e) => onFilterChange({ service: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('incidents.filters.service')}
          >
            <option value="all">{t('incidents.filters.allServices')}</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

