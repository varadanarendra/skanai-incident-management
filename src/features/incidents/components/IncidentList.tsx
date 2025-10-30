import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { IncidentRow } from './IncidentRow';
import { Incident } from '../types/Incident';
import { useTranslation } from 'react-i18next';

interface IncidentListProps {
  incidents: Incident[];
  loading: boolean;
}

const ITEM_HEIGHT = 180;
const MIN_HEIGHT = 400;
const MAX_HEIGHT = 800;

export const IncidentList: React.FC<IncidentListProps> = ({ incidents, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">{t('incidents.loading')}</p>
        </div>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">{t('incidents.noIncidents')}</p>
          <p className="mt-2 text-sm text-gray-500">{t('incidents.noIncidentsDescription')}</p>
        </div>
      </div>
    );
  }

  // Calculate list height based on number of items
  const listHeight = Math.min(Math.max(incidents.length * ITEM_HEIGHT, MIN_HEIGHT), MAX_HEIGHT);

  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const incident = incidents[index];
    return (
      <div style={{ ...style, padding: '8px' }}>
        <IncidentRow incident={incident} />
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-2" role="region" aria-label="Incidents list">
      <List
        height={listHeight}
        itemCount={incidents.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
        overscanCount={5}
      >
        {Row}
      </List>
    </div>
  );
};

