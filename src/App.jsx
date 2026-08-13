import { Routes, Route } from "react-router-dom";
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
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidates" element={<CandidateList />} />
        <Route path="/candidates/new" element={<AddCandidate />} />
        <Route path="/candidates/:id" element={<CandidateDetail />} />
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
        <Route
          path="/interviews/skillgap"
          element={<InterviewSkillGap />}
        />
        <Route path="/ai/skillgap" element={<SkillGap />} />
      </Route>
    </Routes>
  );
}

export default App;
