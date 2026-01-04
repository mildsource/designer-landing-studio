import { Router, Response } from 'express';
import db from '../database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get current user's profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const profile = db.prepare(`
      SELECT * FROM profiles WHERE user_id = ?
    `).get(req.user!.id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update current user's profile
router.put('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { full_name, phone, company, avatar_url } = req.body;

    const result = db.prepare(`
      UPDATE profiles 
      SET full_name = ?, phone = ?, company = ?, avatar_url = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(full_name || null, phone || null, company || null, avatar_url || null, req.user!.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user!.id);
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
