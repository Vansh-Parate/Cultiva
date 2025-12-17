import { useEffect, useState, useCallback } from 'react';
import { useRealtimeUpdates, RealTimeEvents } from './useRealtimeUpdates';
import { useAuthContext } from '@/contexts/AuthContext';

export interface CareTask {
  id: string;
  plantName: string;
  plantId?: string;
  type: string;
  frequency: string;
  dueDate: Date;
  completed: boolean;
  notes?: string;
  priority: string;
  userId: string;
}

export const useRealtimeCareTasks = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(false);
  const { subscribe, subscribeToCareTasks, connected } = useRealtimeUpdates();
  const { user } = useAuthContext();

  // Fetch initial tasks
  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/care-tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        })));
      }
    } catch (error) {
      console.error('Failed to fetch care tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Setup real-time listeners
  useEffect(() => {
    if (!connected) return;

    subscribeToCareTasks();

    // Task created
    const unsubCreateTask = subscribe(RealTimeEvents.CARE_TASK_CREATED, (newTask) => {
      setTasks((prev) => [...prev, { ...newTask, dueDate: new Date(newTask.dueDate) }]);
    });

    // Task updated
    const unsubUpdateTask = subscribe(RealTimeEvents.CARE_TASK_UPDATED, (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id
            ? { ...updatedTask, dueDate: new Date(updatedTask.dueDate) }
            : task
        )
      );
    });

    // Task completed
    const unsubCompleteTask = subscribe(RealTimeEvents.CARE_TASK_COMPLETED, ({ taskId, completedAt }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: true, completedAt: new Date(completedAt) } : task
        )
      );
    });

    // Task deleted
    const unsubDeleteTask = subscribe(RealTimeEvents.CARE_TASK_DELETED, ({ taskId }) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    });

    // Task snoozed
    const unsubSnoozeTask = subscribe(RealTimeEvents.CARE_TASK_SNOOZED, ({ taskId, newDueDate }) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, dueDate: new Date(newDueDate) } : task
        )
      );
    });

    return () => {
      unsubCreateTask?.();
      unsubUpdateTask?.();
      unsubCompleteTask?.();
      unsubDeleteTask?.();
      unsubSnoozeTask?.();
    };
  }, [connected, subscribe, subscribeToCareTasks]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Helper functions
  const completeTask = useCallback(async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:6969/api/v1/care-tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...updatedTask, dueDate: new Date(updatedTask.dueDate) } : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  }, []);

  const snoozeTask = useCallback(async (taskId: string, days: number = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:6969/api/v1/care-tasks/${taskId}/snooze`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...updatedTask, dueDate: new Date(updatedTask.dueDate) } : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to snooze task:', error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:6969/api/v1/care-tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<CareTask, 'id' | 'userId'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6969/api/v1/care-tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, { ...newTask, dueDate: new Date(newTask.dueDate) }]);
        return newTask;
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }, []);

  // Get task statistics
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length;
    const dueToday = tasks.filter((t) => {
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return (
        !t.completed &&
        taskDate.toDateString() === today.toDateString()
      );
    }).length;

    return { total, completed, overdue, dueToday };
  }, [tasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    completeTask,
    snoozeTask,
    deleteTask,
    createTask,
    getStats,
  };
};
