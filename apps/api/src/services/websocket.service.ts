import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { prisma } from '../db';

// Define event types
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

interface UserSocketMap {
  [userId: string]: Socket[];
}

class WebSocketService {
  private io: Server | null = null;
  private userSockets: UserSocketMap = {};
  private userRooms: Map<string, Set<string>> = new Map(); // userId -> Set of roomIds

  /**
   * Initialize WebSocket server
   */
  public initialize(server: HTTPServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:5173',
          'https://green-care-gamma.vercel.app'
        ],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
      maxHttpBufferSize: 10 * 1024 * 1024, // 10MB for image uploads
    });

    this.setupConnectionHandlers();
    console.log('WebSocket server initialized');
    return this.io;
  }

  /**
   * Setup connection and disconnection handlers
   */
  private setupConnectionHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle user authentication
      socket.on('auth', async (userId: string) => {
        socket.data.userId = userId;
        this.addUserSocket(userId, socket);
        socket.join(`user:${userId}`);

        // Mark user as online
        this.broadcastUserStatus(userId, 'online');
        console.log(`User ${userId} authenticated on socket ${socket.id}`);
      });

      // Handle room subscriptions (for real-time plant updates)
      socket.on('subscribe:plant', (plantId: string) => {
        socket.join(`plant:${plantId}`);
        this.addToUserRoom(socket.data.userId, `plant:${plantId}`);
        console.log(`User ${socket.data.userId} subscribed to plant ${plantId}`);
      });

      // Handle care task subscriptions
      socket.on('subscribe:caretasks', () => {
        socket.join(`user:${socket.data.userId}:caretasks`);
        console.log(`User ${socket.data.userId} subscribed to care tasks`);
      });

      // Handle weather subscriptions
      socket.on('subscribe:weather', (location: string) => {
        socket.join(`weather:${location}`);
        console.log(`Socket ${socket.id} subscribed to weather for ${location}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
          this.removeUserSocket(userId, socket);
          if (!this.hasUserSockets(userId)) {
            this.broadcastUserStatus(userId, 'offline');
          }
          console.log(`User ${userId} disconnected (socket: ${socket.id})`);
        }
      });

      // Handle errors
      socket.on('error', (error: any) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Emit event to a specific user's sockets
   */
  public emitToUser(userId: string, event: RealTimeEvents | string, data: any): void {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to a specific plant's subscribers
   */
  public emitToPlant(plantId: string, event: RealTimeEvents | string, data: any): void {
    if (!this.io) return;
    this.io.to(`plant:${plantId}`).emit(event, data);
  }

  /**
   * Emit event to all connected clients
   */
  public broadcastEvent(event: RealTimeEvents | string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  /**
   * Emit event to user's care task room
   */
  public emitToUserCareTasks(userId: string, event: RealTimeEvents | string, data: any): void {
    if (!this.io) return;
    this.io.to(`user:${userId}:caretasks`).emit(event, data);
  }

  /**
   * Emit event to weather subscribers
   */
  public emitWeatherUpdate(location: string, weatherData: any): void {
    if (!this.io) return;
    this.io.to(`weather:${location}`).emit(RealTimeEvents.WEATHER_UPDATED, weatherData);
  }

  /**
   * Get all connected sockets for a user
   */
  private addUserSocket(userId: string, socket: Socket): void {
    if (!this.userSockets[userId]) {
      this.userSockets[userId] = [];
    }
    this.userSockets[userId].push(socket);
  }

  /**
   * Remove socket from user's connections
   */
  private removeUserSocket(userId: string, socket: Socket): void {
    if (this.userSockets[userId]) {
      this.userSockets[userId] = this.userSockets[userId].filter(s => s !== socket);
      if (this.userSockets[userId].length === 0) {
        delete this.userSockets[userId];
      }
    }
  }

  /**
   * Check if user has any active sockets
   */
  private hasUserSockets(userId: string): boolean {
    return this.userSockets[userId] && this.userSockets[userId].length > 0;
  }

  /**
   * Add room to user's subscription list
   */
  private addToUserRoom(userId: string, roomId: string): void {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId)!.add(roomId);
  }

  /**
   * Broadcast user online/offline status
   */
  private broadcastUserStatus(userId: string, status: 'online' | 'offline'): void {
    if (!this.io) return;
    this.io.emit(status === 'online' ? RealTimeEvents.USER_ONLINE : RealTimeEvents.USER_OFFLINE, {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  /**
   * Get IO instance
   */
  public getIO(): Server | null {
    return this.io;
  }
}

// Export singleton
export const webSocketService = new WebSocketService();
