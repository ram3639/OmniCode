# OmniCode — AI-Powered Smart Coding Coach

> A comprehensive, interactive platform for learning programming concepts through real-time algorithm visualizations, multi-language code execution, AI-driven code translation, AST analysis, complexity estimation, and intelligent tutoring.

---

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Docker Services](#docker-services)
- [License](#license)

---

## About

**OmniCode** is a full-stack educational platform that acts as a **Smart Coding Coach**. It goes beyond traditional DSA learning by combining interactive algorithm visualizations, AI-powered code translation, Abstract Syntax Tree (AST) analysis, time/space complexity estimation, a multi-language coding playground, and gamified problem-solving — all in a single unified environment.

Instead of passively reading documentation, students interact with **step-by-step animated visualizers**, write and execute code in **4 programming languages**, receive **real-time AI-powered hints**, translate code between languages with **bidirectional line-mapping**, and track their **learning progress** over time.

---

## Key Features

### Interactive Algorithm Visualizers
- **15+ visualizers** covering Sorting, Searching, Stacks, Queues, Linked Lists, Trees, Graphs, Pathfinding (A*, Dijkstra), Dynamic Programming, String Matching, Backtracking, and Recursion.
- **Gamified puzzles** — 8-Puzzle, Tic-Tac-Toe, Tower of Hanoi, and Water Jug.
- **Synchronized pseudocode highlighting** — the correct line of pseudocode highlights as the animation plays.

### Multi-Language Playground
- Write and test algorithm implementations in **JavaScript, Python, Java, and C++**.
- **20 algorithm templates** across 7 categories with starter code and solutions in all 4 languages.
- **AI-powered code validation** — for non-JavaScript languages, an AI model compares user code against the reference solution before generating the visualization.
- **Client-side JavaScript execution** with instrumented callbacks for instant visualization.

### AI-Powered Code Translation
- Translate code between **Python, C++, C, Java, and JavaScript** using a local LLM (Ollama) with Google Gemini as fallback.
- **Bidirectional line-mapping** — hover over any line of source code to see the corresponding translated line highlighted, and vice versa.
- Auto-scroll to the highlighted line on the opposite panel.

### Coding Challenges
- Curated problem sets with **multiple test cases** and **custom input** support.
- Code execution powered by **Judge0** (sandboxed, supporting Java, Python, C++, and JavaScript).
- **AI-generated hints** when stuck, powered by Ollama/Gemini.

### AST Visualization & Complexity Analysis
- **Abstract Syntax Tree (AST)** generation using Tree-sitter, rendered as interactive flowcharts.
- **Time and Space complexity analysis** powered by AI.

### User Authentication & Progress Tracking
- **JWT-based local authentication** and **Google OAuth 2.0** sign-in.
- Personalized **dashboard** showing solved challenges, completion rates, and AI-generated learning recommendations.

### Admin Portal
- Platform **telemetry dashboard** with user analytics, system health monitoring, and usage metrics.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Zustand, React Router, Lucide Icons, CodeMirror |
| **Backend** | Node.js 22, Express.js, Mongoose, Passport.js, JWT |
| **AI Service** | Ollama (local LLM — qwen2.5-coder:3b), Google Gemini API (fallback) |
| **Microservice** | Python, FastAPI, Tree-sitter, CodeBERT (UniXcoder) |
| **Code Execution** | Judge0 CE 1.13.1 (sandboxed via Docker) |
| **Database** | MongoDB 7 |
| **Infrastructure** | Docker Compose, Redis, PostgreSQL |
| **Styling** | Dark theme with copper accents, inline CSS, CSS variables |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │Visualizer│ │Playground│ │Translation│ │ Challenges/Editor │  │
│  └────┬─────┘ └────┬─────┘ └─────┬─────┘ └────────┬──────────┘  │
│       │             │             │                 │             │
└───────┼─────────────┼─────────────┼─────────────────┼────────────┘
        │             │             │                 │
        ▼             ▼             ▼                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js + Express)                    │
│  ┌─────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │Auth/JWT │ │AI Service │ │Translation│ │ Submission Ctrl   │  │
│  │MongoDB  │ │Ollama/    │ │Controller │ │ Judge0 Gateway    │  │
│  │Passport │ │Gemini     │ │           │ │                   │  │
│  └─────────┘ └───────────┘ └───────────┘ └─────────┬─────────┘  │
│                                                     │            │
└─────────────────────────────┬───────────────────────┼────────────┘
                              │                       │
                    ┌─────────▼──────────┐  ┌─────────▼──────────┐
                    │   MICROSERVICE     │  │      JUDGE0        │
                    │ Python + FastAPI   │  │  Docker Sandbox    │
                    │ Tree-sitter (AST)  │  │  Java/Python/C++   │
                    │ CodeBERT (AI)      │  │  Redis + Postgres  │
                    └────────────────────┘  └────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (recommended: v22)
- **Python** >= 3.10
- **Docker Desktop** (for MongoDB, Judge0, Redis, PostgreSQL)
- **Ollama** (for local AI) — install from [ollama.com](https://ollama.com)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/ram3639/OmniCode.git
cd OmniCode

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Install microservice dependencies (optional, for AST features)
cd ../microservice
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `SESSION_SECRET` | Secret key for Express sessions |
| `GEMINI_API_KEY` | Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey)) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `JUDGE0_API_URL` | Judge0 API URL (default: `http://localhost:2358`) |
| `MICROSERVICE_URL` | Python microservice URL (default: `http://localhost:8000`) |
| `FRONTEND_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |

### Running the Application

#### 1. Start Docker Services

```bash
# From the project root
docker-compose up -d mongodb redis postgres judge0-server judge0-workers
```

> **Note:** Do not run `docker-compose up -d` without specifying services, as it will also build the Python microservice container which takes significant time.

#### 2. Pull the AI Model

```bash
ollama pull qwen2.5-coder:3b
ollama serve  # Keep running in a separate terminal
```

#### 3. Start the Backend

```bash
cd server
npm run dev
```

#### 4. Start the Frontend

```bash
cd client
npm run dev
```

#### 5. (Optional) Start the Python Microservice

```bash
cd microservice
python -m app.main
```

The application will be available at **http://localhost:5173**.

#### Seeding the Database

To populate the database with coding challenges:

```bash
cd server
node seed/seed.js
```

---

## Project Structure

```
OmniCode/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── visualizer/          # 15+ algorithm visualizers
│   │   │   ├── playground/          # Playground templates & sandbox
│   │   │   ├── editor/              # CodeMirror editor components
│   │   │   ├── ast/                 # AST flowchart renderer
│   │   │   ├── auth/                # Protected & Admin routes
│   │   │   ├── dashboard/           # Metrics & charts
│   │   │   ├── layout/              # Navbar & Sidebar
│   │   │   └── puzzles/             # Parsons puzzles
│   │   ├── pages/                   # Route-level page components
│   │   ├── services/                # API service modules
│   │   ├── store/                   # Zustand state stores
│   │   └── App.jsx                  # Root component & router
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js Backend (Express)
│   ├── src/
│   │   ├── controllers/             # Route handlers
│   │   │   ├── authController.js    # Login, Register, OAuth
│   │   │   ├── submissionController.js  # Judge0 code execution
│   │   │   ├── playgroundController.js  # AI validation & hints
│   │   │   ├── translationController.js # Code translation
│   │   │   └── ...
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # Express route definitions
│   │   ├── services/                # Business logic & integrations
│   │   │   ├── geminiService.js     # Ollama + Gemini AI layer
│   │   │   └── judge0Service.js     # Judge0 API client
│   │   ├── middleware/              # Auth, rate limiting, error handling
│   │   └── index.js                 # Express app entry point
│   ├── seed/                        # Database seed scripts
│   ├── .env.example
│   └── package.json
│
├── microservice/                    # Python AI Microservice (FastAPI)
│   ├── app/
│   │   ├── routers/                 # AST, similarity, health endpoints
│   │   ├── services/
│   │   │   ├── tree_sitter_service.py   # AST parsing via Tree-sitter
│   │   │   ├── codebert_service.py      # Code similarity via CodeBERT
│   │   │   ├── ast_to_flowchart.py      # AST → Flowchart conversion
│   │   │   └── error_mapper.py          # Error location mapping
│   │   ├── models/schemas.py
│   │   ├── config.py
│   │   └── main.py                  # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml               # MongoDB, Redis, PostgreSQL, Judge0
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email/password |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `PUT` | `/api/auth/password` | Change password |
| `GET` | `/api/auth/google` | Initiate Google OAuth |

### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/challenges` | List all challenges |
| `GET` | `/api/challenges/:id` | Get challenge details |
| `POST` | `/api/submit` | Submit code for Judge0 execution |

### AI & Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/playground/validate` | AI code validation & hints |
| `POST` | `/api/translate` | Translate code between languages |
| `POST` | `/api/complexity` | Analyze time/space complexity |
| `POST` | `/api/ast/parse` | Generate AST from code |

### Progress & Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progress` | Get user learning progress |
| `GET` | `/api/admin/stats` | Admin telemetry dashboard |
| `GET` | `/api/health` | Server health check |

---

## Docker Services

The `docker-compose.yml` orchestrates 5 containers:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `mongodb` | mongo:7 | 27017 | Primary application database |
| `redis` | redis:7-alpine | 6379 | Judge0 job queue |
| `postgres` | postgres:15-alpine | 5432 | Judge0 metadata storage |
| `judge0-server` | judge0/judge0:1.13.1 | 2358 | Code execution API |
| `judge0-workers` | judge0/judge0:1.13.1 | — | Background execution workers |

> **Note:** Judge0 is configured with `cgroups v2` compatibility flags for Docker Desktop on Windows/macOS.




## License

This project is developed for academic research purposes.
