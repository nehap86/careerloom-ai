# CareerLoom AI

**Intelligent Career Transition Platform by CareerLoom Technologies**

AI-powered web application that helps mid-career professionals (ages 30-55) navigate career transitions by identifying transferable skills, exploring viable career paths, and following personalized learning roadmaps.

![CareerLoom AI](https://img.shields.io/badge/CareerLoom-AI-1B4F72?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite)
![D3.js](https://img.shields.io/badge/D3.js-Visualization-F9A03C?style=flat-square&logo=d3.js)

---

## Features

### AI Skill Assessment
- Paste resume or experience text
- AI extracts transferable skills with proficiency levels
- Maps skills to O\*NET occupational categories
- Visual proficiency bars by category

### Career Path Explorer (D3.js)
- Interactive force-directed graph visualization
- Center node = current role, surrounding nodes = target careers
- Node size = market demand, color intensity = skill overlap %
- Hover tooltips with salary, growth rate, and feasibility
- Click to view detailed transition analysis
- Zoom, pan, and drag interactions

### Learning Roadmaps
- AI-generated 12-week learning plans
- Week-by-week topics with curated resources
- Estimated hours per week
- Progress tracking with completion checkboxes
- Visual progress bar

### Additional Features
- JWT authentication (register/login)
- Mobile responsive design
- Mock mode (works without OpenAI API key)
- Demo accounts with pre-seeded data
- Toast notifications and loading states
- Error boundaries and 404 handling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, D3.js |
| Backend | Node.js, Express.js |
| Database | SQLite (sql.js) |
| AI | OpenAI GPT-4o (optional - mock mode available) |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| HTTP | Axios with JWT interceptor |
| Notifications | react-hot-toast |
| Icons | react-icons |

---

## Project Structure

```
careerloom-ai/
├── client/                  # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, ErrorBoundary, Spinner
│   │   ├── context/         # AuthContext (JWT state management)
│   │   ├── pages/           # Landing, Login, Register, Dashboard,
│   │   │                    # Assess, Explore (D3.js), Roadmap, NotFound
│   │   ├── api.js           # Axios instance with JWT interceptor
│   │   ├── App.jsx          # Router + protected routes
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind + custom styles
│   ├── .env
│   └── package.json
├── server/                  # Express.js backend
│   ├── middleware/           # auth, errorHandler, validate
│   ├── routes/              # auth, skills, careers, roadmap
│   ├── db.js                # SQLite schema + connection
│   ├── mockData.js          # Mock responses for demo mode
│   ├── seed.js              # Database seeder
│   ├── index.js             # Express server entry
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Setup

```bash
# Clone the repository
cd careerloom-ai

# Install server dependencies
cd server
npm install

# Seed the database with sample data
npm run seed

# Start the server (runs on port 5000)
npm run dev

# In a new terminal - install client dependencies
cd ../client
npm install

# Start the client (runs on port 5173)
npm run dev
```

Open **http://localhost:5173** in your browser.

### Demo Accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| sarah@demo.com | demo123 | Marketing Manager |
| james@demo.com | demo123 | Financial Analyst |
| emily@demo.com | demo123 | Project Manager |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key for live AI | No* |

\* **Mock Mode**: When `OPENAI_API_KEY` is not set, the app runs in mock mode with realistic sample data. All features work without any paid API.

### Client (`client/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) | No |

---

## API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user (protected) |

### Skills
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/skills/assess` | AI skill extraction from resume text |
| GET | `/api/skills/profile` | Get user skill profile |

### Careers
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/careers/explore` | Get matched career paths |

### Roadmaps
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/roadmap/generate` | Generate 12-week learning plan |
| GET | `/api/roadmap/:pathId` | Get roadmap for a career path |
| PATCH | `/api/roadmap/:id/progress` | Toggle week completion |

### Health
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server status + mock mode check |

---

## Screenshots

> *Screenshots section - add screenshots of your running application here*

| Page | Description |
|------|-------------|
| Landing Page | Hero section with feature cards and CTA |
| Skill Assessment | Resume input with AI-extracted skill proficiency bars |
| Career Explorer | D3.js force-directed graph with career nodes |
| Learning Roadmap | Week-by-week timeline with progress tracking |

---

## Color Scheme

- **Primary (Navy):** `#1B4F72`
- **Accent (Teal):** `#17A2B8`
- **Background:** White
- **Cards:** Gray-50

---

## License

MIT License - Built by CareerLoom Technologies
