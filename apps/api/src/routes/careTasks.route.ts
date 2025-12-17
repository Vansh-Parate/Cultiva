import express, { Router } from 'express';
import { authenticateJWT } from '@/middleware/authMiddleware';
import { prisma } from '@/db';
import { eventEmitterService } from '@/services/eventEmitter.service';

const router: Router = express.Router();

// Get all care tasks for a user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { start, end, type, priority, completed, q } = req.query as {
      start?: string;
      end?: string;
      type?: string;
      priority?: string;
      completed?: string;
      q?: string;
    };
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const where: any = { userId };
    if (start || end) {
      where.dueDate = {};
      if (start) where.dueDate.gte = new Date(start);
      if (end) where.dueDate.lte = new Date(end);
    }
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (typeof completed !== 'undefined') where.completed = completed === 'true';
    if (q) where.plantName = { contains: q, mode: 'insensitive' };

    const tasks = await (prisma as any).careTask.findMany({
      where,
      orderBy: { dueDate: 'asc' }
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch care tasks' });
  }
});

// Care tasks stats (counts grouped)
router.get('/stats', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const now = new Date();
    const startOfToday = new Date(now.setHours(0,0,0,0));
    const endOfToday = new Date(new Date().setHours(23,59,59,999));

    const [total, completedCount, overdue, dueToday] = await Promise.all([
      (prisma as any).careTask.count({ where: { userId } }),
      (prisma as any).careTask.count({ where: { userId, completed: true } }),
      (prisma as any).careTask.count({ where: { userId, completed: false, dueDate: { lt: new Date() } } }),
      (prisma as any).careTask.count({ where: { userId, completed: false, dueDate: { gte: startOfToday, lte: endOfToday } } })
    ]);

    // 14-day trend
    const start = new Date();
    start.setDate(start.getDate() - 13);
    start.setHours(0,0,0,0);
    const trendRaw = await (prisma as any).careTask.groupBy({
      by: ['completed'],
      where: { userId, dueDate: { gte: start } },
      _count: { _all: true }
    });

    res.json({ total, completed: completedCount, overdue, dueToday, trend: trendRaw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Calendar view (group tasks by date)
router.get('/calendar', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { start, end } = req.query as { start?: string; end?: string };
    const startDate = start ? new Date(start) : new Date(new Date().setDate(new Date().getDate() - 7));
    const endDate = end ? new Date(end) : new Date(new Date().setDate(new Date().getDate() + 21));

    const tasks = await (prisma as any).careTask.findMany({
      where: { userId, dueDate: { gte: startDate, lte: endDate } },
      orderBy: { dueDate: 'asc' }
    });

    const byDate: Record<string, any[]> = {};
    for (const t of tasks) {
      const key = new Date(t.dueDate).toISOString().slice(0,10);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(t);
    }
    res.json(byDate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Task templates (static for now)
router.get('/templates', authenticateJWT, async (_req, res) => {
  const templates = [
    { type: 'watering', frequency: 'weekly', notes: 'Water when top soil is dry', priority: 'medium' },
    { type: 'fertilizing', frequency: 'monthly', notes: 'Balanced fertilizer during growth', priority: 'low' },
    { type: 'pruning', frequency: 'quarterly', notes: 'Remove yellow leaves', priority: 'low' },
    { type: 'pest-control', frequency: 'monthly', notes: 'Inspect leaves, apply neem if needed', priority: 'medium' }
  ];
  res.json(templates);
});

// Activity logs for tasks
router.get('/:id/activity', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const taskId = req.params.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const task = await (prisma as any).careTask.findFirst({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Using CareLog model if exists, otherwise return synthetic log
    const logs = await (prisma as any).careLog?.findMany?.({
      where: { careType: task.type, plantId: task.plantId || undefined },
      orderBy: { completedAt: 'desc' },
      take: 20
    }).catch(() => []);

    res.json(logs || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Schedules (using CareSchedule model)
router.get('/schedules', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const schedules = await (prisma as any).careSchedule.findMany({
      where: { plant: { userId } },
      include: { plant: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.post('/schedules', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { plantId, careType, frequencyDays } = req.body as { plantId: string; careType: string; frequencyDays: number };
    if (!plantId || !careType || !frequencyDays) return res.status(400).json({ error: 'plantId, careType, frequencyDays required' });

    // Verify plant belongs to user
    const plant = await (prisma as any).plant.findFirst({ where: { id: plantId, userId } });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    const schedule = await (prisma as any).careSchedule.create({
      data: { plantId, careType, frequencyDays }
    });
    res.status(201).json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.delete('/schedules/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const id = req.params.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const schedule = await (prisma as any).careSchedule.findFirst({ where: { id, plant: { userId } } });
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    await (prisma as any).careSchedule.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

// Create a new care task
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { plantName, plantId, type, frequency, dueDate, notes, priority } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    if (!plantName || !type || !frequency || !dueDate || !priority) {
      return res.status(400).json({ 
        error: 'Missing required fields: plantName, type, frequency, dueDate, priority' 
      });
    }

    const task = await (prisma as any).careTask.create({
      data: {
        plantName,
        plantId: plantId || null,
        type,
        frequency,
        dueDate: new Date(dueDate),
        notes: notes || null,
        priority,
        userId,
        completed: false
      }
    });

    // Emit real-time event
    eventEmitterService.emitCareTaskCreated(userId, task);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create care task' });
  }
});

// Mark a task as completed
router.patch('/:id/complete', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const taskId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const task = await (prisma as any).careTask.findFirst({
      where: { id: taskId, userId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await (prisma as any).careTask.update({
      where: { id: taskId },
      data: { completed: true }
    });

    // Emit real-time event
    eventEmitterService.emitCareTaskCompleted(userId, taskId, updatedTask);

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Snooze a task by N days
router.patch('/:id/snooze', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const taskId = req.params.id;
    const { days = 1 } = req.body as { days?: number };

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!taskId) return res.status(400).json({ error: 'Task ID is required' });

    const task = await (prisma as any).careTask.findFirst({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const currentDue = new Date(task.dueDate);
    const newDue = new Date(currentDue);
    newDue.setDate(currentDue.getDate() + Number(days || 1));

    const updated = await (prisma as any).careTask.update({
      where: { id: taskId },
      data: { dueDate: newDue }
    });

    // Emit real-time event
    eventEmitterService.emitCareTaskSnoozed(userId, taskId, newDue);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to snooze task' });
  }
});

// Bulk complete tasks
router.post('/bulk-complete', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { ids } = req.body as { ids: string[] };
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });

    const result = await (prisma as any).careTask.updateMany({
      where: { id: { in: ids }, userId },
      data: { completed: true }
    });

    res.json({ updated: result.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to bulk complete tasks' });
  }
});

// Update a care task
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const taskId = req.params.id;
    const { plantName, type, frequency, dueDate, notes, priority } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Validate required fields
    if (!plantName || !type || !frequency || !dueDate || !priority) {
      return res.status(400).json({ 
        error: 'Missing required fields: plantName, type, frequency, dueDate, priority' 
      });
    }

    const task = await (prisma as any).careTask.findFirst({
      where: { id: taskId, userId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await (prisma as any).careTask.update({
      where: { id: taskId },
      data: {
        plantName,
        type,
        frequency,
        dueDate: new Date(dueDate),
        notes: notes || null,
        priority
      }
    });

    // Emit real-time event
    eventEmitterService.emitCareTaskUpdated(userId, updatedTask);

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a care task
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const taskId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const task = await (prisma as any).careTask.findFirst({
      where: { id: taskId, userId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await (prisma as any).careTask.delete({
      where: { id: taskId }
    });

    // Emit real-time event
    eventEmitterService.emitCareTaskDeleted(userId, taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 