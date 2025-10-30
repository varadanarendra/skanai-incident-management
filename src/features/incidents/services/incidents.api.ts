import { httpClient } from '@/core/http/client';
import { Incident } from '../types/Incident';

/**
 * Incidents API Service
 * Framework-agnostic REST API functions
 */

export const incidentsApi = {
  /**
   * Get all incidents
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    severity?: string;
    status?: string;
    service?: string;
  }): Promise<{
    data: Incident[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    countsBySeverity: { critical: number; high: number; medium: number; low: number; total: number };
    countsByStatus: { open: number; investigating: number; resolved: number; total: number };
  }> {
    const response = await httpClient.get('/incidents', { params });
    return response.data as any;
  },

  /**
   * Get incident by ID
   */
  async getById(id: string): Promise<Incident> {
    const response = await httpClient.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  /**
   * Create new incident
   */
  async create(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Promise<Incident> {
    const response = await httpClient.post<Incident>('/incidents', incident);
    return response.data;
  },

  /**
   * Update existing incident
   */
  async update(id: string, updates: Partial<Incident>): Promise<Incident> {
    const response = await httpClient.patch<Incident>(`/incidents/${id}`, updates);
    return response.data;
  },

  /**
   * Resolve incident
   */
  async resolve(id: string): Promise<Incident> {
    const response = await httpClient.patch<Incident>(`/incidents/${id}/resolve`, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });
    return response.data;
  },

  /**
   * Delete incident
   */
  async delete(id: string): Promise<void> {
    await httpClient.delete(`/incidents/${id}`);
  },

  /**
   * Get incidents by service
   */
  async getByService(service: string): Promise<Incident[]> {
    const response = await httpClient.get<Incident[]>('/incidents', {
      params: { service },
    });
    return response.data;
  },

  /**
   * Get incidents by severity
   */
  async getBySeverity(severity: string): Promise<Incident[]> {
    const response = await httpClient.get<Incident[]>('/incidents', {
      params: { severity },
    });
    return response.data;
  },

  /**
   * Get incidents by status
   */
  async getByStatus(status: string): Promise<Incident[]> {
    const response = await httpClient.get<Incident[]>('/incidents', {
      params: { status },
    });
    return response.data;
  },
};

