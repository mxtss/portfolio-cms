import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ExperienceModal from "../components/ExperienceModal";
import {
  getExperience,
  deleteExperience,
} from "../services/api";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  const loadExperience = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExperience();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to load experience:", error);
      setError(error.message || "Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleAddExperience = () => {
    setSelectedExperience(null);
    setShowModal(true);
  };

  const handleEditExperience = (experience) => {
    setSelectedExperience(experience);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedExperience(null);
  };

  const handleExperienceSaved = (savedExperience) => {
    if (selectedExperience) {
      setExperiences((currentExperiences) =>
        currentExperiences.map((experience) =>
          experience.id === savedExperience.id
            ? savedExperience
            : experience
        )
      );
    } else {
      setExperiences((currentExperiences) => [
        savedExperience,
        ...currentExperiences,
      ]);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      await deleteExperience(id);

      setExperiences((currentExperiences) =>
        currentExperiences.filter(
          (experience) => experience.id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-US",
      {
        month: "short",
        year: "numeric",
      }
    );
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

              <h2>Experience</h2>

              <p className="page-description">
                Manage your work experience and internships.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={handleAddExperience}
            >
              + Add Experience
            </button>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading experience...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            experiences.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">◈</div>

                <h3>No experience yet</h3>

                <p>
                  Add your first work experience or internship.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            experiences.length > 0 && (
              <div className="projects-table-card">
                <div className="table-header">
                  <div>
                    <h3>All Experience</h3>

                    <p>
                      {experiences.length} experience
                      {experiences.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="projects-table-wrapper">
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Company</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {experiences.map((experience) => (
                        <tr key={experience.id}>
                          <td>
                            <div className="project-name-cell">
                              <div className="project-thumbnail-placeholder">
                                ◈
                              </div>

                              <div>
                                <strong>
                                  {experience.role}
                                </strong>

                                <span>
                                  {experience.description.length > 60
                                    ? `${experience.description.substring(
                                        0,
                                        60
                                      )}...`
                                    : experience.description}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="technology-text">
                              {experience.company}
                            </span>
                          </td>

                          <td>
                            <div className="experience-date">
                              <span>
                                {formatDate(
                                  experience.start_date
                                )}
                              </span>

                              <span>—</span>

                              <span>
                                {experience.is_current
                                  ? "Present"
                                  : formatDate(
                                      experience.end_date
                                    )}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="experience-status">
                              {experience.is_current && (
                                <span className="current-badge">
                                  Current
                                </span>
                              )}

                              <span
                                className={
                                  experience.is_published
                                    ? "status-badge published"
                                    : "status-badge draft"
                                }
                              >
                                {experience.is_published
                                  ? "Published"
                                  : "Draft"}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-button edit"
                                onClick={() =>
                                  handleEditExperience(
                                    experience
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="action-button delete"
                                onClick={() =>
                                  handleDelete(
                                    experience.id
                                  )
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
        <ExperienceModal
          experience={selectedExperience}
          onClose={handleModalClose}
          onSaved={handleExperienceSaved}
        />
      )}
    </div>
  );
}

export default Experience;