import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '@/middleware/authMiddleware';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all care tasks for a user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { start, end } = req.query as { start?: string; end?: string };
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const where: any = { userId };
    if (start || end) {
      where.dueDate = {};
      if (start) where.dueDate.gte = new Date(start);
      if (end) where.dueDate.lte = new Date(end);
    }

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