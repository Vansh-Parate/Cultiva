import express, { Router } from 'express';
import { authenticateJWT } from '@/middleware/authMiddleware';
import { prisma } from '@/db';

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

    const [total, completedCount, overdue, dueToday] = await Promise.all([
      (prisma as any).careTask.count({ where: { userId } }),
      (prisma as any).careTask.count({ where: { userId, completed: true } }),
      (prisma as any).careTask.count({ where: { userId, completed: false, dueDate: { lt: new Date() } } }),
      (prisma as any).careTask.count({
        where: {
          userId,
          completed: false,
          AND: [
            { dueDate: { gte: new Date(new Date().setHours(0,0,0,0)) } },
            { dueDate: { lte: new Date(new Date().setHours(23,59,59,999)) } }
          ]
        }
      })
    ]);

    res.json({ total, completed: completedCount, overdue, dueToday });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
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

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 