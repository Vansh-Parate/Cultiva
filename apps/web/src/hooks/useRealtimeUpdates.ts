import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from '@/contexts/AuthContext';

export enum RealTimeEvents {
  // Plant events
  PLANT_CREATED = 'plant:created',
  PLANT_UPDATED = 'plant:updated',
  PLANT_DELETED = 'plant:deleted',
  PLANT_IMAGE_ADDED = 'plant:image:added',

  // Health events
  HEALTH_CHECK_START = 'health:check:start',
  HEALTH_CHECK_COMPLETE = 'health:check:complete',
  HEALTH_STATUS_UPDATED = 'health:status:updated',

  // Care task events
  CARE_TASK_CREATED = 'care:task:created',
  CARE_TASK_UPDATED = 'care:task:updated',
  CARE_TASK_COMPLETED = 'care:task:completed',
  CARE_TASK_DELETED = 'care:task:deleted',
  CARE_TASK_SNOOZED = 'care:task:snoozed',

  // Notification events
  NOTIFICATION_SENT = 'notification:sent',
  NOTIFICATION_READ = 'notification:read',

  // Community events
  POST_CREATED = 'post:created',
  POST_LIKED = 'post:liked',
  POST_UNLIKED = 'post:unliked',
  COMMENT_ADDED = 'comment:added',

  // Weather events
  WEATHER_UPDATED = 'weather:updated',

  // AI events
  AI_RESPONSE = 'ai:response',
  AI_DISEASE_DETECTION = 'ai:disease:detection',

  // System events
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
}

export interface RealtimeListener {
  event: RealTimeEvents | string;
  callback: (data: any) => void;
}

export const useRealtimeUpdates = () => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [listeners, setListeners] = useState<Map<string, Function[]>>(new Map());
  const { user } = useAuthContext();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:6969', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      // Authenticate with backend
      socket.emit('auth', user.id);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  // Subscribe to an event
  const subscribe = useCallback(
    (event: RealTimeEvents | string, callback: (data: any) => void) => {
      if (!socketRef.current) return;

      socketRef.current.on(event, callback);

      // Track listener for cleanup
      setListeners((prev) => {
        const newListeners = new Map(prev);
        const callbacks = newListeners.get(event) || [];
        newListeners.set(event, [...callbacks, callback]);
        return newListeners;
      });

      // Return unsubscribe function
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, callback);
        }
      };
    },
    []
  );

  // Unsubscribe from an event
  const unsubscribe = useCallback((event: RealTimeEvents | string) => {
    if (!socketRef.current) return;
    socketRef.current.off(event);
    setListeners((prev) => {
      const newListeners = new Map(prev);
      newListeners.delete(event);
      return newListeners;
    });
  }, []);

  // Subscribe to plant updates
  const subscribeToPlant = useCallback((plantId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('subscribe:plant', plantId);
  }, []);

  // Subscribe to care tasks
  const subscribeToCareTasks = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('subscribe:caretasks');
  }, []);

  // Subscribe to weather
  const subscribeToWeather = useCallback((location: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('subscribe:weather', location);
  }, []);

  return {
    socket: socketRef.current,
    connected,
    subscribe,
    unsubscribe,
    subscribeToPlant,
    subscribeToCareTasks,
    subscribeToWeather,
  };
};
