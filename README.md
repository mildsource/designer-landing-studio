# Studio - Self-Hosted Application

A fully self-hosted React + Express application with SQLite database and JWT authentication.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file** with your configuration:
   - `JWT_SECRET`: Change to a secure random string for production
   - `DATABASE_PATH`: Path to SQLite database file (default: `./data/studio.db`)

4. **Start development servers:**
   ```bash
   npm run dev:full
   ```

   This starts both:
   - Frontend (Vite) on http://localhost:8080
   - Backend (Express) on http://localhost:3001

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server only |
| `npm run dev:server` | Start backend development server only |
| `npm run dev:full` | Start both frontend and backend concurrently |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Compile backend TypeScript |
| `npm run build:all` | Build both frontend and backend |
| `npm run start` | Start production server (serves frontend + API) |
| `npm run preview` | Preview production frontend build |

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build:all
   ```

2. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your-secure-secret-key
   export PORT=3001
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The server will serve both the static frontend files and the API endpoints.

## Project Structure

```
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── database.ts        # SQLite database setup
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # JWT authentication
│   └── routes/            # API route handlers
│       ├── auth.ts        # Authentication endpoints
│       ├── profiles.ts    # User profile endpoints
│       ├── scheduled-calls.ts  # Call scheduling endpoints
│       └── contact.ts     # Contact form endpoint
├── src/                   # Frontend React application
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/              # Utilities and API client
│   │   └── api.ts        # REST API client
│   └── pages/            # Page components
├── data/                  # SQLite database storage (created at runtime)
└── dist/                  # Production frontend build
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
- `GET /api/scheduled-calls/availability/:date` - Get booked slots for a date (public)
- `POST /api/scheduled-calls` - Create scheduled call (requires auth)
- `PATCH /api/scheduled-calls/:id` - Update scheduled call (requires auth)

### Contact
- `POST /api/contact` - Submit contact message (requires auth)

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, TypeScript
- **Database:** SQLite (via better-sqlite3)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL for frontend | `http://localhost:3001/api` |
| `PORT` | Backend server port | `3001` |
| `JWT_SECRET` | Secret key for JWT signing | (required in production) |
| `DATABASE_PATH` | Path to SQLite database file | `./data/studio.db` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:8080` |
| `NODE_ENV` | Environment mode | `development` |

## License

MIT
