import React from "react";
import SkillGap from "../ai/SkillGap";
import InterviewList from "./InterviewList";
import ScheduleInterview from "./ScheduleInterview";

export default function InterviewSkillGap() {
  return (
    <div className="interview-skillgap">
      <div className="grid">
        <section className="panel">
          <h2>Skill Gap Analysis</h2>
          <SkillGap />
        </section>

        <section className="panel">
          <h2>Interviews</h2>
          <InterviewList />
          <ScheduleInterview />
        </section>
      </div>
    </div>
  );
}
