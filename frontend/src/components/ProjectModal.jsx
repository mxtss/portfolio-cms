import { useEffect, useState } from "react";
import { createProject, updateProject } from "../services/api";

function ProjectModal({ project, onClose, onSaved }) {
  const isEditing = Boolean(project);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setTechnologies(project.technologies || "");
      setGithubUrl(project.github_url || "");
      setLiveUrl(project.live_url || "");
      setIsPublished(project.is_published || false);
    } else {
      setTitle("");
      setDescription("");
      setTechnologies("");
      setGithubUrl("");
      setLiveUrl("");
      setImage(null);
      setIsPublished(false);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!technologies.trim()) {
      setError("Please enter at least one technology.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", technologies);
      formData.append("github_url", githubUrl);
      formData.append("live_url", liveUrl);
      formData.append("is_published", isPublished);

      if (image) {
        formData.append("image", image);
      }

      let savedProject;

      if (isEditing) {
        savedProject = await updateProject(project.id, formData);
      } else {
        savedProject = await createProject(formData);
      }

      onSaved(savedProject);
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
      setError(error.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="project-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {isEditing ? "EDIT PROJECT" : "NEW PROJECT"}
            </p>

            <h2>
              {isEditing ? "Edit Project" : "Add Project"}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Title *</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Insurance Management Platform"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Technologies *</label>

            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, Django, PostgreSQL"
            />

            <small>
              Separate technologies with commas.
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>

              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="form-group">
              <label>Live URL</label>

              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0] || null)}
            />

            {project?.image && !image && (
              <small>
                Current image will be kept unless you select a new one.
              </small>
            )}
          </div>

          <div className="publish-toggle">
            <div>
              <strong>Publish Project</strong>

              <span>
                Published projects can appear on your public portfolio.
              </span>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />

              <span className="slider"></span>
            </label>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;