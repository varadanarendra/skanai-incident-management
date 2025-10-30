import { Incident, IncidentSeverity, IncidentStatus } from '@/features/incidents/types/Incident';

/**
 * Mock data generator for testing purposes
 * Can be used when backend is not available
 */

const severities: IncidentSeverity[] = ['critical', 'high', 'medium', 'low'];
const statuses: IncidentStatus[] = ['open', 'investigating', 'resolved'];
const services = ['API Gateway', 'Auth Service', 'Database', 'Payment Service', 'Email Service', 'Storage'];

const titles = [
  'High latency in API responses',
  'Database connection pool exhausted',
  'Payment processing failures',
  'Email delivery delays',
  'Increased error rate in authentication',
  'Storage service unavailable',
  'Memory leak detected in service',
  'Rate limiting triggered',
  'SSL certificate expiring soon',
  'Disk space running low',
];

const descriptions = [
  'Users are experiencing slow response times when accessing the service.',
  'Multiple connection timeouts have been detected in the last 15 minutes.',
  'Service is returning 500 errors for approximately 10% of requests.',
  'Automated monitoring has detected an anomaly in the service behavior.',
  'Resource utilization has exceeded normal thresholds.',
  'Third-party dependency is currently unavailable.',
  'Service health check is failing intermittently.',
  'Critical security vulnerability detected and needs immediate attention.',
  'Performance degradation observed during peak hours.',
  'Scheduled maintenance window approaching.',
];

export function generateMockIncident(id?: string): Incident {
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  const updatedAt = new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);

  return {
    id: id || `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    severity,
    status,
    service,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    ...(status === 'resolved' && { resolvedAt: updatedAt.toISOString() }),
  };
}

export function generateMockIncidents(count: number = 20): Incident[] {
  return Array.from({ length: count }, () => generateMockIncident());
}

