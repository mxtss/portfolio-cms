import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EducationModal from "../components/EducationModal";
import {
  getEducation,
  deleteEducation,
} from "../services/api";

function Education() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  const loadEducation = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEducation();
      setEducation(data);
    } catch (error) {
      console.error("Failed to load education:", error);
      setError(error.message || "Failed to load education.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleAddEducation = () => {
    setSelectedEducation(null);
    setShowModal(true);
  };

  const handleEditEducation = (item) => {
    setSelectedEducation(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEducation(null);
  };

  const handleEducationSaved = (savedEducation) => {
    if (selectedEducation) {
      setEducation((currentEducation) =>
        currentEducation.map((item) =>
          item.id === savedEducation.id
            ? savedEducation
            : item
        )
      );
    } else {
      setEducation((currentEducation) => [
        savedEducation,
        ...currentEducation,
      ]);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmed) return;

    try {
      await deleteEducation(id);

      setEducation((currentEducation) =>
        currentEducation.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete education:", error);
      alert("Failed to delete education.");
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

              <h2>Education</h2>

              <p className="page-description">
                Manage your academic background and qualifications.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={handleAddEducation}
            >
              + Add Education
            </button>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading education...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            education.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">▤</div>

                <h3>No education yet</h3>

                <p>
                  Add your first educational qualification.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            education.length > 0 && (
              <div className="projects-table-card">
                <div className="table-header">
                  <div>
                    <h3>All Education</h3>

                    <p>
                      {education.length} qualification
                      {education.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="projects-table-wrapper">
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Education</th>
                        <th>Institution</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {education.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="project-name-cell">
                              <div className="project-thumbnail-placeholder">
                                ▤
                              </div>

                              <div>
                                <strong>
                                  {item.degree}
                                </strong>

                                <span>
                                  {item.field_of_study}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="technology-text">
                              {item.institution}
                            </span>
                          </td>

                          <td>
                            <div className="experience-date">
                              <span>
                                {formatDate(item.start_date)}
                              </span>

                              <span>—</span>

                              <span>
                                {formatDate(item.end_date)}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={
                                item.is_published
                                  ? "status-badge published"
                                  : "status-badge draft"
                              }
                            >
                              {item.is_published
                                ? "Published"
                                : "Draft"}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-button edit"
                                onClick={() =>
                                  handleEditEducation(item)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="action-button delete"
                                onClick={() =>
                                  handleDelete(item.id)
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
        <EducationModal
          education={selectedEducation}
          onClose={handleModalClose}
          onSaved={handleEducationSaved}
        />
      )}
    </div>
  );
}

export default Education;