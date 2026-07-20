// saarthiIQ-Frontend\src\App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './router/PrivateRoute'
import RoleRoute from './router/RoleRoute'
import AppShell from './components/layout/AppShell'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// App pages
import Dashboard from './pages/dashboard/Dashboard'
import CandidateList from './pages/candidates/CandidateList'
import CandidateDetail from './pages/candidates/CandidateDetail'
import AddCandidate from './pages/candidates/AddCandidate'
import ResumeUpload from './pages/resume/ResumeUpload'
import ResumeScore from './pages/resume/ResumeScore'
import JobMatch from './pages/resume/JobMatch'
import SkillGap from './pages/ai/SkillGap'
import AIReport from './pages/ai/AIReport'
import InterviewList from './pages/interviews/InterviewList'
import ScheduleInterview from './pages/interviews/ScheduleInterview'
import CampaignList from './pages/campaigns/CampaignList'
import CreateCampaign from './pages/campaigns/CreateCampaign'
import TaskBoard from './pages/tasks/TaskBoard'
import Analytics from './pages/analytics/Analytics'
import UserManagement from './pages/admin/UserManagement'
import AuditLog from './pages/admin/AuditLog'
import Profile from './pages/profile/Profile'

import LoadingScreen from './components/ui/LoadingScreen'

export default function App() {
  const { loading } = useAuth()
  if (loading) return <LoadingScreen />

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes inside AppShell */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard"      element={<Dashboard />} />

          {/* Candidates — recruiter + admin */}
          <Route element={<RoleRoute roles={['admin','recruiter']} />}>
            <Route path="/candidates"         element={<CandidateList />} />
            <Route path="/candidates/add"     element={<AddCandidate />} />
            <Route path="/candidates/:id"     element={<CandidateDetail />} />
            <Route path="/candidates/:id/edit" element={<AddCandidate />} />
          </Route>

          {/* Resume & AI — recruiter + admin */}
          <Route element={<RoleRoute roles={['admin','recruiter']} />}>
            <Route path="/resume"             element={<ResumeUpload />} />
            <Route path="/resume/score/:id"   element={<ResumeScore />} />
            <Route path="/resume/match/:id"   element={<JobMatch />} />
            <Route path="/ai/skill-gap"        element={<SkillGap />} />
            <Route path="/ai/report"           element={<AIReport />} />
          </Route>

          {/* Interviews — all except basic user */}
          <Route element={<RoleRoute roles={['admin','recruiter','interviewer']} />}>
            <Route path="/interviews"           element={<InterviewList />} />
            <Route path="/interviews/schedule"  element={<ScheduleInterview />} />
          </Route>

          {/* Campaigns & Tasks — recruiter + admin */}
          <Route element={<RoleRoute roles={['admin','recruiter']} />}>
            <Route path="/campaigns"            element={<CampaignList />} />
            <Route path="/campaigns/create"     element={<CreateCampaign />} />
            <Route path="/tasks"                element={<TaskBoard />} />
            <Route path="/analytics"            element={<Analytics />} />
          </Route>

          {/* Admin only */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin/users"  element={<UserManagement />} />
            <Route path="/admin/audit"  element={<AuditLog />} />
          </Route>

          {/* Profile — all roles */}
          <Route path="/profile" element={<Profile />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
