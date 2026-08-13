import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/candidates">Candidates</NavLink>
          </li>
          {/* Resumes removed from sidenav, now lives under candidates */}
          <li>
            <NavLink to="/interviews/skillgap">SkillGap & Interviews</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
