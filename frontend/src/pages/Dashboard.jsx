import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getProjects,
  getSkills,
  getExperience,
  getMessages,
} from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          projects,
          skills,
          experience,
          messages,
        ] = await Promise.all([
          getProjects(),
          getSkills(),
          getExperience(),
          getMessages(),
        ]);

        setStats({
          projects: projects.length,
          skills: skills.length,
          experience: experience.length,
          messages: messages.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />

        <section className="dashboard-content">
          <div className="welcome-card">
            <div>
              <p className="eyebrow">YOUR PORTFOLIO</p>

              <h2>
                Let's make your
                <br />
                portfolio shine ✨
              </h2>

              <p>
                Manage your projects, skills, experience and messages
                from one place.
              </p>
            </div>

            <div className="welcome-decoration">
              ♡
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">▣</span>
              <p>Projects</p>
              <h3>{loading ? "..." : stats.projects}</h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">✦</span>
              <p>Skills</p>
              <h3>{loading ? "..." : stats.skills}</h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">◈</span>
              <p>Experience</p>
              <h3>{loading ? "..." : stats.experience}</h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">♡</span>
              <p>Messages</p>
              <h3>{loading ? "..." : stats.messages}</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;