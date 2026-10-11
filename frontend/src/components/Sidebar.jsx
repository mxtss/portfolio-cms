import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>✦</span>
        <h2>Mitali CMS</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/projects">
          <span>▣</span>
          Projects
        </NavLink>

        <NavLink to="/dashboard/skills">
          <span>✦</span>
          Skills
        </NavLink>

        <NavLink to="/dashboard/experience">
          <span>◈</span>
          Experience
        </NavLink>

        <NavLink to="/dashboard/education">
          <span>▤</span>
          Education
        </NavLink>

        <NavLink to="/dashboard/messages">
          <span>♡</span>
          Messages
        </NavLink>
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        <span>↪</span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;