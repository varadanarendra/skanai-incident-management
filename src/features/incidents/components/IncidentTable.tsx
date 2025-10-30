import React from 'react';
import { Incident } from '../types/Incident';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface IncidentTableProps {
  incidents: Incident[];
  loading: boolean;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents, loading }) => {
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
          <p className="mt-4 text-lg font-medium text-gray-900">{t('incidents.noIncidents')}</p>
          <p className="mt-2 text-sm text-gray-500">{t('incidents.noIncidentsDescription')}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('incidents.severity.medium')}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('incidents.status.open')}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('incidents.service')}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-gray-50 transition-all duration-200">
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    'px-2 py-1 text-xs font-semibold rounded uppercase',
                    {
                      'bg-critical text-white': incident.severity === 'critical',
                      'bg-high text-white': incident.severity === 'high',
                      'bg-medium text-white': incident.severity === 'medium',
                      'bg-low text-white': incident.severity === 'low',
                    }
                  )}
                >
                  {t(`incidents.severity.${incident.severity}`)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    'px-2 py-1 text-xs font-medium rounded capitalize',
                    {
                      'bg-red-100 text-red-800': incident.status === 'open',
                      'bg-yellow-100 text-yellow-800': incident.status === 'investigating',
                      'bg-green-100 text-green-800': incident.status === 'resolved',
                    }
                  )}
                >
                  {t(`incidents.status.${incident.status}`)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{incident.service}</td>
              <td className="px-4 py-3 text-sm text-gray-900 truncate" title={incident.title}>{incident.title}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(incident.createdAt)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(incident.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


