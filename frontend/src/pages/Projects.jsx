import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectModal from "../components/ProjectModal";
import { getProjects, deleteProject } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      setError(error.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleProjectSaved = (savedProject) => {
    if (selectedProject) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === savedProject.id ? savedProject : project
        )
      );
    } else {
      setProjects((currentProjects) => [
        savedProject,
        ...currentProjects,
      ]);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteProject(id);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
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

              <h2>Projects</h2>

              <p className="page-description">
                Manage the projects displayed on your portfolio.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={handleAddProject}
            >
              + Add Project
            </button>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">▣</div>

              <h3>No projects yet</h3>

              <p>
                Add your first project to start building your portfolio.
              </p>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="projects-table-card">
              <div className="table-header">
                <div>
                  <h3>All Projects</h3>

                  <p>
                    {projects.length} project(s)
                  </p>
                </div>
              </div>

              <div className="projects-table-wrapper">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Technologies</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div className="project-name-cell">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="project-thumbnail"
                              />
                            ) : (
                              <div className="project-thumbnail-placeholder">
                                ▣
                              </div>
                            )}

                            <div>
                              <strong>
                                {project.title}
                              </strong>

                              <span>
                                {project.description.length > 60
                                  ? `${project.description.substring(
                                      0,
                                      60
                                    )}...`
                                  : project.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="technology-text">
                            {project.technologies}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              project.is_published
                                ? "status-badge published"
                                : "status-badge draft"
                            }
                          >
                            {project.is_published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            project.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button edit"
                              onClick={() =>
                                handleEditProject(project)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="action-button delete"
                              onClick={() =>
                                handleDelete(project.id)
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
        <ProjectModal
          project={selectedProject}
          onClose={handleModalClose}
          onSaved={handleProjectSaved}
        />
      )}
    </div>
  );
}

export default Projects;