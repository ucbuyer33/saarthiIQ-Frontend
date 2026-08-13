import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/dashboard/Dashboard";
import CandidateList from "./pages/candidates/CandidateList";
import CandidateDetail from "./pages/candidates/CandidateDetail";
import AddCandidate from "./pages/candidates/AddCandidate";
import ResumeUpload from "./pages/resume/ResumeUpload";
import ResumeScore from "./pages/resume/ResumeScore";
import JobMatch from "./pages/resume/JobMatch";
import InterviewSkillGap from "./pages/interviews/InterviewSkillGap";
import SkillGap from "./pages/ai/SkillGap";

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/new" element={<AddCandidate />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          {/* Resumes embedded under candidate detail */}
          <Route
            path="/candidates/:id/resume"
            element={
              <>
                <ResumeUpload />
                <ResumeScore />
                <JobMatch />
              </>
            }
          />
          {/* Combined SkillGap + Interviews */}
          <Route
            path="/interviews/skillgap"
            element={<InterviewSkillGap />}
          />
          {/* Direct SkillGap page (used by nav or candidate link) */}
          <Route path="/ai/skillgap" element={<SkillGap />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
