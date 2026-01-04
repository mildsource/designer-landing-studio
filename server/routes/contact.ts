import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Submit a contact message (requires auth)
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO contact_messages (id, name, email, message)
      VALUES (?, ?, ?, ?)
    `).run(id, name, email, message);

    res.status(201).json({ id, name, email, message });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
