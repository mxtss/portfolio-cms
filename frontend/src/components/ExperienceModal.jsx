import { useEffect, useState } from "react";
import { createExperience, updateExperience } from "../services/api";

function ExperienceModal({ experience, onClose, onSaved }) {
  const isEditing = Boolean(experience);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (experience) {
      setCompany(experience.company || "");
      setRole(experience.role || "");
      setDescription(experience.description || "");
      setStartDate(experience.start_date || "");
      setEndDate(experience.end_date || "");
      setIsCurrent(experience.is_current || false);
      setIsPublished(experience.is_published || false);
    } else {
      setCompany("");
      setRole("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setIsCurrent(false);
      setIsPublished(false);
    }
  }, [experience]);

  const handleCurrentChange = (e) => {
    const checked = e.target.checked;

    setIsCurrent(checked);

    if (checked) {
      setEndDate("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!role.trim()) {
      setError("Role is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!isCurrent && !endDate) {
      setError(
        "Please provide an end date or mark this experience as current."
      );
      return;
    }

    try {
      setLoading(true);

      const experienceData = {
        company,
        role,
        description,
        start_date: startDate,
        end_date: isCurrent ? null : endDate,
        is_current: isCurrent,
        is_published: isPublished,
      };

      let savedExperience;

      if (isEditing) {
        savedExperience = await updateExperience(
          experience.id,
          experienceData
        );
      } else {
        savedExperience = await createExperience(experienceData);
      }

      onSaved(savedExperience);
      onClose();
    } catch (error) {
      console.error("Failed to save experience:", error);
      setError(error.message || "Failed to save experience.");
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
              {isEditing ? "EDIT EXPERIENCE" : "NEW EXPERIENCE"}
            </p>

            <h2>
              {isEditing ? "Edit Experience" : "Add Experience"}
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
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. ABC Technologies"
              />
            </div>

            <div className="form-group">
              <label>Role *</label>

              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Python Developer Intern"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your responsibilities, work and achievements..."
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isCurrent}
              />

              {isCurrent && (
                <small>
                  End date is disabled for current experience.
                </small>
              )}
            </div>
          </div>

          <div className="publish-toggle">
            <div>
              <strong>Currently Working Here</strong>

              <span>
                Select this if this is your current experience.
              </span>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={handleCurrentChange}
              />

              <span className="slider"></span>
            </label>
          </div>

          <div className="publish-toggle">
            <div>
              <strong>Publish Experience</strong>

              <span>
                Published experience can appear on your public portfolio.
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
                : "Create Experience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExperienceModal;