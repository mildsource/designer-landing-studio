# Studio - Self-Hosted Application

A production-ready, self-hosted Node.js application with Express backend and React frontend.

## Deployment (Dokploy / VPS)

### Environment Variables

Set these in your deployment platform:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT tokens |
| `NODE_ENV` | No | - | Set to `production` |
| `DATABASE_PATH` | No | `./data/studio.db` | SQLite database path |

### Dokploy Configuration

1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`

The application will be ready immediately after deployment - no manual steps required.

## Required package.json Scripts

After cloning, add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:server": "tsx watch server/index.ts",
    "dev:full": "concurrently \"npm run dev\" \"npm run dev:server\"",
    "build": "vite build && tsc -p tsconfig.server.json",
    "start": "node dist-server/index.js",
    "preview": "vite preview"
  }
}
```

## Architecture

- **Frontend:** React + Vite (built to `/dist`)
- **Backend:** Express + SQLite (built to `/dist-server`)
- **Production:** Single Node.js process serves both API and static files
- **API Routes:** All under `/api/*` (relative paths, works behind reverse proxy)

## Local Development

```bash
# Install dependencies
npm install

# Create .env file (optional - has sensible defaults)
cp .env.example .env

# Run both frontend and backend
npm run dev:full

# Frontend: http://localhost:8080 (proxies to backend)
# Backend: http://localhost:3000
```

## Project Structure

```
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── database.ts        # SQLite database setup
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # JWT authentication
│   └── routes/            # API route handlers
├── src/                   # Frontend React application
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/api.ts         # REST API client
│   └── pages/             # Page components
├── data/                  # SQLite database (created at runtime)
├── dist/                  # Production frontend build
└── dist-server/           # Production backend build
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Profiles
- `GET /api/profiles/me` - Get current user profile (requires auth)
- `PUT /api/profiles/me` - Update current user profile (requires auth)

### Scheduled Calls
- `GET /api/scheduled-calls` - Get user's scheduled calls (requires auth)
- `GET /api/scheduled-calls/availability/:date` - Get booked slots (public)
- `POST /api/scheduled-calls` - Create scheduled call (requires auth)
- `PATCH /api/scheduled-calls/:id` - Update scheduled call (requires auth)

### Contact
- `POST /api/contact` - Submit contact message (requires auth)

### Health Check
- `GET /api/health` - Server health check

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, TypeScript
- **Database:** SQLite (via better-sqlite3)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

## License

MIT
