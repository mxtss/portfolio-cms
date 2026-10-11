import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SkillModal from "../components/SkillModal";
import { getSkills, deleteSkill } from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);
      setError(error.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setShowModal(true);
  };

  const handleEditSkill = (skill) => {
    setSelectedSkill(skill);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSkill(null);
  };

  const handleSkillSaved = (savedSkill) => {
    if (selectedSkill) {
      setSkills((currentSkills) =>
        currentSkills.map((skill) =>
          skill.id === savedSkill.id ? savedSkill : skill
        )
      );
    } else {
      setSkills((currentSkills) => [
        savedSkill,
        ...currentSkills,
      ]);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await deleteSkill(id);

      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert("Failed to delete skill.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />

        <section className="dashboard-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">CONTENT MANAGEMENT</p>

              <h2>Skills</h2>

              <p className="page-description">
                Manage the skills displayed on your portfolio.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={handleAddSkill}
            >
              + Add Skill
            </button>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading skills...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && skills.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>

              <h3>No skills yet</h3>

              <p>
                Add your first skill to start building your portfolio.
              </p>
            </div>
          )}

          {!loading && !error && skills.length > 0 && (
            <div className="projects-table-card">
              <div className="table-header">
                <div>
                  <h3>All Skills</h3>

                  <p>
                    {skills.length} skill(s)
                  </p>
                </div>
              </div>

              <div className="projects-table-wrapper">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Category</th>
                      <th>Proficiency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id}>
                        <td>
                          <div className="project-name-cell">
                            <div className="project-thumbnail-placeholder">
                              ✦
                            </div>

                            <div>
                              <strong>
                                {skill.name}
                              </strong>

                              <span>
                                {skill.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="technology-text">
                            {skill.category}
                          </span>
                        </td>

                        <td>
                          <div className="proficiency-cell">
                            <div className="proficiency-bar">
                              <div
                                className="proficiency-fill"
                                style={{
                                  width: `${skill.proficiency}%`,
                                }}
                              ></div>
                            </div>

                            <span>
                              {skill.proficiency}%
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              skill.is_published
                                ? "status-badge published"
                                : "status-badge draft"
                            }
                          >
                            {skill.is_published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button edit"
                              onClick={() =>
                                handleEditSkill(skill)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="action-button delete"
                              onClick={() =>
                                handleDelete(skill.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <SkillModal
          skill={selectedSkill}
          onClose={handleModalClose}
          onSaved={handleSkillSaved}
        />
      )}
    </div>
  );
}

export default Skills;