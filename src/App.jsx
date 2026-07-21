// saarthiIQ-Frontend\src\App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './router/PrivateRoute'
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
import ActivityLog from './pages/activity/ActivityLog'
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

      {/* Protected Routes inside AppShell — single-role (recruiter) app, no per-route RBAC */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard"      element={<Dashboard />} />

          <Route path="/candidates"         element={<CandidateList />} />
          <Route path="/candidates/add"     element={<AddCandidate />} />
          <Route path="/candidates/:id"     element={<CandidateDetail />} />
          <Route path="/candidates/:id/edit" element={<AddCandidate />} />

          <Route path="/resume"             element={<ResumeUpload />} />
          <Route path="/resume/score/:id"   element={<ResumeScore />} />
          <Route path="/resume/match/:id"   element={<JobMatch />} />
          <Route path="/ai/skill-gap"        element={<SkillGap />} />
          <Route path="/ai/report"           element={<AIReport />} />

          <Route path="/interviews"           element={<InterviewList />} />
          <Route path="/interviews/schedule"  element={<ScheduleInterview />} />

          <Route path="/campaigns"            element={<CampaignList />} />
          <Route path="/campaigns/create"     element={<CreateCampaign />} />
          <Route path="/tasks"                element={<TaskBoard />} />
          <Route path="/analytics"            element={<Analytics />} />

          <Route path="/activity"             element={<ActivityLog />} />

          <Route path="/profile" element={<Profile />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
