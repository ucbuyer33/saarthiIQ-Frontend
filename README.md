# SaarthiIQ Frontend

AI-powered Recruitment Intelligence Platform — Frontend built with **React + Vite**.

> Pair this with [saarthiIQ-Backend](https://github.com/bhoomis736-alt/saarthiIQ-Backend) (FastAPI)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| jwt-decode | JWT parsing for role-based access |
| Recharts | Analytics & charts |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |
| React Dropzone | Resume file uploads |
| date-fns | Date formatting |

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/ucbuyer33/saarthiIQ-Frontend.git
cd saarthiIQ-Frontend

# 2. Install
npm install

# 3. Configure env
cp .env.example .env.local
# Edit VITE_API_BASE_URL to your backend URL

# 4. Run
npm run dev
```

App runs at `http://localhost:3000`  
Backend must be running at `http://localhost:8000`

---

## Project Structure

```
src/
├── assets/           # Logo, static images
├── components/
│   ├── layout/       # AppShell, Sidebar, Topbar
│   ├── ui/           # Button, Card, Badge, Input, Modal...
│   └── features/     # CandidateCard, ResumeScore, KPICard...
├── context/          # AuthContext, ThemeContext
├── hooks/            # useAuth, useApi, useDebounce
├── lib/              # api.js, auth.js, constants.js
├── pages/
│   ├── auth/         # Login, Register, ForgotPassword
│   ├── dashboard/    # Dashboard
│   ├── candidates/   # List, Detail, Add
│   ├── resume/       # Upload, View, Score, JobMatch
│   ├── ai/           # SkillGap, AIReport
│   ├── interviews/   # List, Schedule
│   ├── campaigns/    # List, Create
│   ├── tasks/        # TaskBoard (Kanban)
│   ├── analytics/    # Charts & trends
│   ├── admin/        # UserManagement, AuditLog
│   └── profile/      # Profile settings
└── router/           # PrivateRoute, RoleRoute guards
```

---

## User Roles

| Role | Access |
|------|--------|
| `admin` | Full access — users, audit logs, all features |
| `recruiter` | Candidates, resumes, AI tools, interviews, campaigns, tasks |
| `interviewer` | Assigned interviews + candidate view (read-only) |
| `user` | Profile page only |
