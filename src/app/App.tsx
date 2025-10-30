import { useTranslation } from 'react-i18next';
import {
  IncidentTable,
  FilterPanel,
  StatsSummary,
  Pagination,
  useIncidents,
  useIncidentsStream,
} from '@/features/incidents';

/**
 * Root Application Component
 * Main dashboard view for incident management
 */
function App() {
  const { t, i18n } = useTranslation();

  // Initialize WebSocket connection for real-time updates
  useIncidentsStream();

  // Get incidents data and actions
  const {
    incidents,
    loading,
    error,
    connected,
    severityCounts,
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
  } = useIncidents();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                aria-label="Toggle language"
              >
                {i18n.language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              <button
                onClick={refresh}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t('incidents.refresh')}
              >
                {t('incidents.refresh')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            <strong className="font-medium">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Summary */}
        <StatsSummary severityCounts={severityCounts} connected={connected} />

        {/* Incidents Table with Pagination */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('incidents.title')} ({total})
            </h2>
          </div>
          {/* Inline Filters inside incidents section */}
          <div className="mb-3">
            <FilterPanel
              services={services}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              variant="inline"
            />
          </div>
          <IncidentTable incidents={incidents} loading={loading} />
          <div className="mt-2">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            Incident Management Dashboard © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

