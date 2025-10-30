import { WebSocketMessage } from '../types/Incident';
import { incidentsWsClient } from '@/core/ws/wsClient';

/**
 * Incidents WebSocket Service
 * Handles real-time incident updates
 */

export type IncidentWebSocketCallback = (message: WebSocketMessage) => void;

export const incidentsWsService = {
  /**
   * Initialize WebSocket connection
   */
  connect(): void {
    incidentsWsClient.connect();
  },

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    incidentsWsClient.disconnect();
  },

  /**
   * Subscribe to incident updates
   * Returns unsubscribe function
   */
  subscribe(callback: IncidentWebSocketCallback): () => void {
    const handleMessage = (data: any) => {
      // Validate message format
      if (data && data.type && data.payload) {
        callback(data as WebSocketMessage);
      } else {
        console.warn('Invalid WebSocket message format:', data);
      }
    };

    return incidentsWsClient.onMessage(handleMessage);
  },

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(
    onOpen: () => void,
    onClose: () => void,
    onError: (error: Event) => void
  ): () => void {
    const unsubOpen = incidentsWsClient.onOpen(onOpen);
    const unsubClose = incidentsWsClient.onClose(onClose);
    const unsubError = incidentsWsClient.onError(onError);

    // Return combined unsubscribe function
    return () => {
      unsubOpen();
      unsubClose();
      unsubError();
    };
  },

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return incidentsWsClient.isConnected();
  },

  /**
   * Send message to server (if needed for acknowledgments, etc.)
   */
  send(data: any): void {
    incidentsWsClient.send(data);
  },
};

