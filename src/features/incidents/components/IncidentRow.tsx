import React from 'react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types/Incident';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface IncidentRowProps {
  incident: Incident;
  style?: React.CSSProperties;
}

const severityColors: Record<IncidentSeverity, string> = {
  critical: 'bg-critical text-white',
  high: 'bg-high text-white',
  medium: 'bg-medium text-white',
  low: 'bg-low text-white',
};

const statusColors: Record<IncidentStatus, string> = {
  open: 'bg-red-100 text-red-800',
  investigating: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

export const IncidentRow: React.FC<IncidentRowProps> = React.memo(({ incident, style }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('incidents.justNow');
    if (diffMins < 60) return t('incidents.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('incidents.hoursAgo', { count: diffHours });
    return t('incidents.daysAgo', { count: diffDays });
  };

  return (
    <div
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      role="article"
      aria-label={`Incident: ${incident.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left section - Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={clsx(
                'px-2 py-1 text-xs font-semibold rounded uppercase',
                severityColors[incident.severity]
              )}
              aria-label={`Severity: ${incident.severity}`}
            >
              {t(`incidents.severity.${incident.severity}`)}
            </span>
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded capitalize',
                statusColors[incident.status]
              )}
              aria-label={`Status: ${incident.status}`}
            >
              {t(`incidents.status.${incident.status}`)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={incident.title}>
            {incident.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{incident.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium">{t('incidents.service')}:</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">{incident.service}</span>
            </span>
            <span title={formatDate(incident.createdAt)}>{getTimeAgo(incident.createdAt)}</span>
          </div>
        </div>

        {/* Right section - Actions (placeholder for future) */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            aria-label={`View details for ${incident.title}`}
          >
            {t('incidents.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  );
});

IncidentRow.displayName = 'IncidentRow';

