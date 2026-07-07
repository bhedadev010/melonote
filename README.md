# 🍈 Melonote

> AI-powered journaling for personal reflection and meaningful insights.


---

**Melonote** is a full-stack journaling application that combines the simplicity of writing with the power of AI. It analyzes your entries for emotional patterns, provides context-aware chat about your journal history, and helps you reflect more deeply — all wrapped in a calm, modern interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| ✍️ **Journal Freely** | Distraction-free writing with automatic saving. |
| 🧠 **Emotion Detection** | AI analyzes each entry to detect emotions (joy, sadness, anger, etc.) using a Python ML model. |
| 💬 **AI Chat Assistant** | Chat with an AI that understands your journal history via semantic search + Google Gemini. |
| 🔍 **Semantic Search** | Embedding-based similarity search finds the most relevant past entries to any question. |
| 💡 **Spark Ideas** | Get thoughtful, reflective prompts to deepen your writing. |
| 📊 **Dashboard Analytics** | Track writing streaks, total entries, monthly activity, and emotion distribution charts. |
| 🔐 **Secure Authentication** | JWT-based signup/login with bcrypt password hashing. |
| 🌙 **Dark UI** | Modern glassmorphism design with smooth Framer Motion animations. |

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Page & component animations |
| [Recharts](https://recharts.org) | Emotion distribution bar charts |
| [React Router 7](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP client for API calls |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org) | Runtime environment |
| [Express 5](https://expressjs.com) | Web framework & REST API |
| [MongoDB](https://mongodb.com) + [Mongoose](https://mongoosejs.com) | Database & ODM |
| [JWT](https://jwt.io) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Authentication & password hashing |
| [Google Gemini API](https://ai.google.dev) | LLM for chat responses |
| [Python](https://python.org) | Emotion detection & text embedding models |

---

## 📁 Project Structure

```
melonote/
├── backend/                          # Express API server
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Signup, login, profile
│   │   ├── dashboardController.js    # Stats, streaks, emotion distribution
│   │   └── journalController.js      # CRUD + spark ideas + chat
│   ├── middleware/
│   │   └── auth.js                   # JWT verification middleware
│   ├── models/
│   │   ├── User.js                   # User schema (name, email, password)
│   │   ├── JournalEntry.js           # Journal schema (text, emotions, embedding, messages)
│   │   └── ChatHistory.js            # Chat conversation history
│   ├── routes/
│   │   ├── auth.js                   # POST /signup, /login, GET /me
│   │   ├── journal.js                # CRUD + /spark-idea + /chat
│   │   ├── dashboard.js              # GET /stats
│   │   └── health.js                 # GET /health
│   ├── services/
│   │   ├── chatbotService.js         # RAG-based chat with Gemini + cosine similarity
│   │   ├── embeddingService.js       # Python subprocess for text embeddings
│   │   ├── emotionService.js         # Python subprocess for emotion detection
│   │   └── journalProcessingService.js  # Async background processing pipeline
│   ├── utils/
│   │   ├── ai.js                     # Spark idea prompts & question bank
│   │   ├── auth.js                   # JWT token helpers
│   │   ├── embedding_model.py        # Python: sentence-transformers embedding
│   │   └── emotion_model.py          # Python: HuggingFace emotion classifier
│   ├── tests/
│   │   ├── ai.test.js                # AI service unit tests
│   │   └── auth.test.js              # Auth endpoint integration tests
│   ├── server.js                     # Express app entry point
│   └── package.json
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── App.jsx                   # Route definitions
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles + Tailwind
│   │   ├── components/
│   │   │   └── Layout.jsx            # Shared layout wrapper
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Marketing landing page
│   │   │   ├── Auth.jsx              # Login / signup
│   │   │   ├── Home.jsx              # Dashboard with stats & charts
│   │   │   ├── Editor.jsx            # Journal writing editor
│   │   │   ├── Journal.jsx           # Past journal entries list
│   │   │   ├── Chat.jsx              # AI chat interface
│   │   │   ├── Dashboard.jsx         # Full analytics dashboard
│   │   │   └── NotFound.jsx          # 404 page
│   │   └── services/
│   │       └── api.js                # Axios instance with auth interceptor
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.8+ with `pip`
- **MongoDB** running locally (or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)
- **Google Gemini API key** ([get one free](https://ai.google.dev/gemini-api/docs/api-key))

### 1. Clone & Install

```bash
git clone https://github.com/bhedadev010/melonote.git
cd melonote
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `backend/.env` and add your configuration:

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/melonote
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
CLIENT_URL=http://localhost:5173
PYTHON=python
```

Install Python dependencies for AI models:

```bash
pip install sentence-transformers torch transformers
```

Start the backend server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Verify

```bash
curl http://localhost:5000/api/health
# → { "status": "ok", "timestamp": "..." }
```

---

## 📖 API Reference

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | — | Create a new account |
| `POST` | `/api/auth/login` | — | Log in and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

**POST `/api/auth/signup`**

```json
// Request
{ "name": "Your Name", "email": "you@example.com", "password": "yourpassword" }

// Response
{ "token": "jwt_token_here", "user": { "id": "...", "name": "...", "email": "..." } }
```

### Journal Entries

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/journal/entries` | ✅ | Create a new journal entry |
| `GET` | `/api/journal/entries` | ✅ | List recent entries (last 10) |
| `GET` | `/api/journal/entries/:id` | ✅ | Get a single entry |
| `PUT` | `/api/journal/entries/:id` | ✅ | Update an entry |
| `DELETE` | `/api/journal/entries/:id` | ✅ | Delete an entry |
| `POST` | `/api/journal/spark-idea` | ✅ | Get a reflective prompt based on text |

**POST `/api/journal/entries`**

```json
// Request
{ "title": "My Day", "fullText": "Today was...", "messages": [] }

// Response
{ "entry": { "_id": "...", "title": "...", "fullText": "...", "emotions": [], "embedding": [], "createdAt": "..." } }
```

### AI Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/journal/chat` | ✅ | Ask a question about your journals |

**POST `/api/journal/chat`**

```json
// Request
{ "question": "What have I been feeling anxious about lately?" }

// Response
{
  "answer": "Based on your journal entries, you've mentioned work deadlines...",
  "similarJournals": [
    { "_id": "...", "title": "Monday stress", "similarity": 0.87 }
  ]
}
```

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | ✅ | Get journaling stats & analytics |

**GET `/api/dashboard/stats`**

```json
// Response
{
  "totalJournals": 12,
  "journalsThisMonth": 5,
  "mostCommonEmotion": "joy",
  "emotionDistribution": [{ "label": "joy", "count": 4 }, { "label": "sadness", "count": 2 }],
  "streak": 3,
  "recentJournals": [...]
}
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Runs Jest test suites for:
- **AI services** — chatbot reply polishing, incomplete reply detection, fallback answers, cosine similarity
- **Auth endpoints** — signup, login, profile retrieval

### Python Models

The emotion detection and embedding models are invoked as Python subprocesses. To test them directly:

```bash
python backend/utils/emotion_model.py "I feel happy and grateful today"
python backend/utils/embedding_model.py "This is a test sentence"
```

---

## 🏗️ Architecture: AI Pipeline

```
User writes journal entry
        │
        ▼
┌─────────────────────────────┐
│  JournalProcessingService   │  (async, non-blocking)
│                             │
│  ┌───────────────────────┐  │
│  │  Emotion Detection    │  │  Python HuggingFace model
│  │  → [joy: 0.92, ...]   │  │  → stored in entry.emotions
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Embedding Generation │  │  Python sentence-transformers
│  │  → [0.023, -0.45,...] │  │  → stored in entry.embedding
│  └───────────────────────┘  │
└─────────────────────────────┘

User asks a question in chat
        │
        ▼
┌─────────────────────────────┐
│  ChatbotService             │
│                             │
│  1. Generate embedding of   │
│     the question            │
│  2. Cosine similarity       │
│     against all entries     │
│  3. Top-K most relevant     │
│     journal summaries       │
│  4. Build prompt with       │
│     context + question      │
│  5. Send to Gemini API      │
│  6. Polish & validate       │
│     response                │
│  7. Retry if incomplete     │
│  8. Fallback to snippet     │
│     if all retries fail     │
└─────────────────────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

