# Melonote

AI-powered journaling web application for personal reflection and meaningful insights.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Health Check

```bash
curl http://localhost:5000/api/health
```

## Project Structure

```
backend/
  ai/           # AI services (future milestones)
  config/       # Database and app configuration
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  server.js

frontend/
  src/
    components/
    hooks/
    pages/
    services/
    utils/
```

## Development

This project is built milestone by milestone. See the project specification for the full roadmap.
