import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all scheduled calls for current user
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const calls = db.prepare(`
      SELECT * FROM scheduled_calls 
      WHERE user_id = ?
      ORDER BY scheduled_date ASC, scheduled_time ASC
    `).all(req.user!.id);

    res.json(calls);
  } catch (error) {
    console.error('Get scheduled calls error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booked slots for a specific date (public)
router.get('/availability/:date', (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    
    const bookedSlots = db.prepare(`
      SELECT scheduled_time FROM scheduled_calls 
      WHERE scheduled_date = ? AND status != 'cancelled'
    `).all(date) as { scheduled_time: string }[];

    res.json(bookedSlots.map(slot => slot.scheduled_time));
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new scheduled call
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { guest_name, guest_email, scheduled_date, scheduled_time, notes } = req.body;

    if (!guest_name || !guest_email || !scheduled_date || !scheduled_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if slot is already booked
    const existing = db.prepare(`
      SELECT id FROM scheduled_calls 
      WHERE scheduled_date = ? AND scheduled_time = ? AND status != 'cancelled'
    `).get(scheduled_date, scheduled_time);

    if (existing) {
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO scheduled_calls (id, user_id, guest_name, guest_email, scheduled_date, scheduled_time, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(id, req.user!.id, guest_name, guest_email, scheduled_date, scheduled_time, notes || null);

    const call = db.prepare('SELECT * FROM scheduled_calls WHERE id = ?').get(id);
    res.status(201).json(call);
  } catch (error) {
    console.error('Create scheduled call error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a scheduled call (cancel)
router.patch('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify ownership
    const call = db.prepare('SELECT user_id FROM scheduled_calls WHERE id = ?').get(id) as any;
    if (!call) {
      return res.status(404).json({ error: 'Scheduled call not found' });
    }
    if (call.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.prepare(`
      UPDATE scheduled_calls 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);

    const updated = db.prepare('SELECT * FROM scheduled_calls WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    console.error('Update scheduled call error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
