import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useOnline } from '@/core/net/useOnline';

interface StatsSummaryProps {
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  connected: boolean;
}

const zeroCounts = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };

export const StatsSummary: React.FC<StatsSummaryProps> = ({ severityCounts, connected }) => {
  const { t } = useTranslation();
  const safeCounts = severityCounts || zeroCounts;
  const isOnline = useOnline();

  const statusLabel = !isOnline
    ? t('incidents.offline')
    : connected
    ? t('incidents.connected')
    : t('incidents.disconnected');

  const statusDotClass = !isOnline ? 'bg-red-600' : connected ? 'bg-green-500' : 'bg-yellow-500';

  const stats = [
    {
      label: t('incidents.severity.critical'),
      count: safeCounts.critical,
      color: 'bg-critical',
      textColor: 'text-critical',
    },
    {
      label: t('incidents.severity.high'),
      count: safeCounts.high,
      color: 'bg-high',
      textColor: 'text-high',
    },
    {
      label: t('incidents.severity.medium'),
      count: safeCounts.medium,
      color: 'bg-medium',
      textColor: 'text-medium',
    },
    {
      label: t('incidents.severity.low'),
      count: safeCounts.low,
      color: 'bg-low',
      textColor: 'text-low',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('incidents.summary')}</h2>
        <div className="flex items-center gap-2">
          <div
            className={clsx('w-2 h-2 rounded-full', statusDotClass)}
            aria-label={statusLabel}
          />
          <span className="text-sm text-gray-600">{statusLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all hover:shadow-md animate-scale-in"
            role="status"
            aria-label={`${stat.label}: ${stat.count}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={clsx('w-3 h-3 rounded-full', stat.color)} aria-hidden="true" />
              <span className={clsx('text-2xl font-bold', stat.textColor)}>
                {stat.count}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{t('incidents.total')}</span>
          <span className="text-xl font-bold text-gray-900">{safeCounts.total}</span>
        </div>
      </div>
    </div>
  );
};

