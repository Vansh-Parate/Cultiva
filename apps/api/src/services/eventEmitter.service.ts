import { EventEmitter } from 'events';
import { webSocketService, RealTimeEvents } from './websocket.service';

class EventEmitterService extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  /**
   * Plant Events
   */
  emitPlantCreated(plant: any): void {
    this.emit('plant:created', plant);
    webSocketService.emitToUser(plant.userId, RealTimeEvents.PLANT_CREATED, plant);
    webSocketService.broadcastEvent('plant:created', {
      plantId: plant.id,
      name: plant.name,
      timestamp: new Date()
    });
  }

  emitPlantUpdated(plant: any): void {
    this.emit('plant:updated', plant);
    webSocketService.emitToPlant(plant.id, RealTimeEvents.PLANT_UPDATED, plant);
    webSocketService.emitToUser(plant.userId, RealTimeEvents.PLANT_UPDATED, plant);
  }

  emitPlantDeleted(plantId: string, userId: string): void {
    this.emit('plant:deleted', { plantId, userId });
    webSocketService.emitToUser(userId, RealTimeEvents.PLANT_DELETED, { plantId });
  }

  emitPlantImageAdded(plantId: string, image: any): void {
    this.emit('plant:image:added', { plantId, image });
    webSocketService.emitToPlant(plantId, RealTimeEvents.PLANT_IMAGE_ADDED, image);
  }

  /**
   * Health Check Events
   */
  emitHealthCheckStart(plantId: string, userId: string): void {
    this.emit('health:check:start', { plantId, userId });
    webSocketService.emitToUser(userId, RealTimeEvents.HEALTH_CHECK_START, {
      plantId,
      status: 'analyzing'
    });
  }

  emitHealthCheckComplete(plantId: string, userId: string, results: any): void {
    this.emit('health:check:complete', { plantId, userId, results });
    webSocketService.emitToUser(userId, RealTimeEvents.HEALTH_CHECK_COMPLETE, {
      plantId,
      ...results,
      timestamp: new Date()
    });
    webSocketService.emitToPlant(plantId, RealTimeEvents.HEALTH_STATUS_UPDATED, results);
  }

  emitHealthStatusUpdated(plantId: string, status: any): void {
    this.emit('health:status:updated', { plantId, status });
    webSocketService.emitToPlant(plantId, RealTimeEvents.HEALTH_STATUS_UPDATED, status);
  }

  /**
   * Care Task Events
   */
  emitCareTaskCreated(userId: string, task: any): void {
    this.emit('care:task:created', task);
    webSocketService.emitToUser(userId, RealTimeEvents.CARE_TASK_CREATED, task);
    webSocketService.emitToUserCareTasks(userId, RealTimeEvents.CARE_TASK_CREATED, task);
  }

  emitCareTaskUpdated(userId: string, task: any): void {
    this.emit('care:task:updated', task);
    webSocketService.emitToUser(userId, RealTimeEvents.CARE_TASK_UPDATED, task);
    webSocketService.emitToUserCareTasks(userId, RealTimeEvents.CARE_TASK_UPDATED, task);
  }

  emitCareTaskCompleted(userId: string, taskId: string, task: any): void {
    this.emit('care:task:completed', { taskId, task });
    webSocketService.emitToUser(userId, RealTimeEvents.CARE_TASK_COMPLETED, {
      taskId,
      completedAt: new Date(),
      ...task
    });
    webSocketService.emitToUserCareTasks(userId, RealTimeEvents.CARE_TASK_COMPLETED, { taskId });
  }

  emitCareTaskDeleted(userId: string, taskId: string): void {
    this.emit('care:task:deleted', { taskId });
    webSocketService.emitToUser(userId, RealTimeEvents.CARE_TASK_DELETED, { taskId });
    webSocketService.emitToUserCareTasks(userId, RealTimeEvents.CARE_TASK_DELETED, { taskId });
  }

  emitCareTaskSnoozed(userId: string, taskId: string, newDueDate: Date): void {
    this.emit('care:task:snoozed', { taskId, newDueDate });
    webSocketService.emitToUser(userId, RealTimeEvents.CARE_TASK_SNOOZED, {
      taskId,
      newDueDate,
      timestamp: new Date()
    });
    webSocketService.emitToUserCareTasks(userId, RealTimeEvents.CARE_TASK_SNOOZED, { taskId, newDueDate });
  }

  /**
   * Community Events
   */
  emitPostCreated(post: any): void {
    this.emit('post:created', post);
    webSocketService.broadcastEvent(RealTimeEvents.POST_CREATED, {
      postId: post.id,
      title: post.title,
      author: post.user?.fullName,
      timestamp: new Date()
    });
  }

  emitPostLiked(postId: string, userId: string, likeCount: number): void {
    this.emit('post:liked', { postId, userId });
    webSocketService.broadcastEvent(RealTimeEvents.POST_LIKED, {
      postId,
      likeCount,
      timestamp: new Date()
    });
  }

  emitPostUnliked(postId: string, userId: string, likeCount: number): void {
    this.emit('post:unliked', { postId, userId });
    webSocketService.broadcastEvent(RealTimeEvents.POST_UNLIKED, {
      postId,
      likeCount,
      timestamp: new Date()
    });
  }

  emitCommentAdded(postId: string, comment: any): void {
    this.emit('comment:added', { postId, comment });
    webSocketService.broadcastEvent(RealTimeEvents.COMMENT_ADDED, {
      postId,
      commentId: comment.id,
      author: comment.user?.fullName,
      content: comment.content,
      timestamp: new Date()
    });
  }

  /**
   * Notification Events
   */
  emitNotification(userId: string, notification: any): void {
    this.emit('notification:sent', { userId, notification });
    webSocketService.emitToUser(userId, RealTimeEvents.NOTIFICATION_SENT, {
      ...notification,
      timestamp: new Date()
    });
  }

  emitNotificationRead(userId: string, notificationId: string): void {
    this.emit('notification:read', { userId, notificationId });
    webSocketService.emitToUser(userId, RealTimeEvents.NOTIFICATION_READ, { notificationId });
  }

  /**
   * Weather Events
   */
  emitWeatherUpdate(location: string, weather: any): void {
    this.emit('weather:updated', { location, weather });
    webSocketService.emitWeatherUpdate(location, {
      location,
      ...weather,
      timestamp: new Date()
    });
  }

  /**
   * AI Events
   */
  emitAIResponse(userId: string, type: string, response: any): void {
    this.emit('ai:response', { userId, type, response });
    webSocketService.emitToUser(userId, RealTimeEvents.AI_RESPONSE, {
      type,
      ...response,
      timestamp: new Date()
    });
  }

  emitDiseaseDetection(userId: string, plantId: string, results: any): void {
    this.emit('disease:detection', { userId, plantId, results });
    webSocketService.emitToUser(userId, RealTimeEvents.AI_DISEASE_DETECTION, {
      plantId,
      ...results,
      timestamp: new Date()
    });
  }
}

// Export singleton
export const eventEmitterService = new EventEmitterService();
