import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const profileId = uuidv4();

    // Create user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name)
      VALUES (?, ?, ?, ?)
    `).run(userId, email, passwordHash, fullName || null);

    // Create profile
    db.prepare(`
      INSERT INTO profiles (id, user_id, full_name)
      VALUES (?, ?, ?)
    `).run(profileId, userId, fullName || null);

    const token = generateToken({ id: userId, email });

    res.status(201).json({
      user: { id: userId, email, full_name: fullName },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, email, full_name, created_at FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
