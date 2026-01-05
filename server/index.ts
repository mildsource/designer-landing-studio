import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import scheduledCallsRoutes from './routes/scheduled-calls.js';
import contactRoutes from './routes/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fail fast if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// ============================================
// API APP - Handles ONLY /api/* requests
// ============================================
const apiApp = express.Router();

// API-specific middleware
apiApp.use(express.json());

// Mount all API routes
apiApp.use('/auth', authRoutes);
apiApp.use('/profiles', profileRoutes);
apiApp.use('/scheduled-calls', scheduledCallsRoutes);
apiApp.use('/contact', contactRoutes);

// Health check
apiApp.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 404 handler - catches ANY unmatched /api/* request
// This ensures API requests NEVER fall through to the frontend
apiApp.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `API endpoint ${req.method} ${req.originalUrl} does not exist` 
  });
});

// ============================================
// MAIN APP - Orchestrates API and Frontend
// ============================================
const app = express();

// CORS only needed in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// ============================================
// LAYER 1: API (mounted FIRST, handles /api/*)
// ============================================
app.use('/api', apiApp);

// ============================================
// LAYER 2: FRONTEND (mounted AFTER API)
// Static files + SPA fallback
// This layer NEVER sees /api/* requests
// ============================================
const distPath = path.join(__dirname, '../dist');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(distPath));

// SPA fallback - GET only, serves index.html for client-side routing
// This ONLY handles non-API GET requests for paths without file extensions
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API routes: /api/*`);
  console.log(`Frontend: Static files from ${distPath}`);
});

export default app;
