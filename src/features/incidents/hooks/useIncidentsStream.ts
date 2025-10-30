import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useToast } from '@/core/toast/ToastProvider';
import { incidentsWsService } from '../services/incidents.ws';
import { upsertIncident, setConnectionStatus } from '../store/incidents.slice';
import { WebSocketMessage } from '../types/Incident';
import { notifyNewIncident, requestNotificationPermission } from '@/core/notifications/notifications';

/**
 * Custom hook to manage WebSocket connection and incident updates
 * Bridges WebSocket messages to Redux store
 */
export const useIncidentsStream = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    // Handle incoming WebSocket messages
    const handleMessage = (message: WebSocketMessage) => {
      console.log('WebSocket message received:', message.type, message.payload);

      // Update Redux store based on message type
      switch (message.type) {
        case 'incident.created': {
          dispatch(upsertIncident(message.payload));
          notifyNewIncident({
            id: message.payload.id,
            title: message.payload.title,
            severity: message.payload.severity,
            service: message.payload.service,
          });
          showToast({
            type: message.payload.severity === 'critical' ? 'error' : 'info',
            title: 'New incident',
            message: `${message.payload.title} • ${message.payload.service}`,
          });
          break;
        }
        case 'incident.updated':
        case 'incident.resolved':
          dispatch(upsertIncident(message.payload));
          break;
        default:
          console.warn('Unknown WebSocket message type:', message.type);
      }
    };

    // Handle connection status changes
    const handleOpen = () => {
      console.log('WebSocket connected');
      dispatch(setConnectionStatus(true));
      requestNotificationPermission();
    };

    const handleClose = () => {
      console.log('WebSocket disconnected');
      dispatch(setConnectionStatus(false));
    };

    const handleError = (error: Event) => {
      console.error('WebSocket error:', error);
      dispatch(setConnectionStatus(false));
    };

    // Subscribe to WebSocket events
    const unsubscribeMessages = incidentsWsService.subscribe(handleMessage);
    const unsubscribeConnection = incidentsWsService.onConnectionChange(
      handleOpen,
      handleClose,
      handleError
    );

    // Connect to WebSocket
    incidentsWsService.connect();

    // Cleanup on unmount
    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      incidentsWsService.disconnect();
    };
  }, [dispatch]);
};

