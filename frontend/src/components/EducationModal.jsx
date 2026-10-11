import { useEffect, useState } from "react";
import { createEducation, updateEducation } from "../services/api";

function EducationModal({ education, onClose, onSaved }) {
  const isEditing = Boolean(education);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (education) {
      setInstitution(education.institution || "");
      setDegree(education.degree || "");
      setFieldOfStudy(education.field_of_study || "");
      setStartDate(education.start_date || "");
      setEndDate(education.end_date || "");
      setDescription(education.description || "");
      setIsPublished(education.is_published || false);
    } else {
      setInstitution("");
      setDegree("");
      setFieldOfStudy("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setIsPublished(false);
    }
  }, [education]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!institution.trim()) {
      setError("Institution name is required.");
      return;
    }

    if (!degree.trim()) {
      setError("Degree is required.");
      return;
    }

    if (!fieldOfStudy.trim()) {
      setError("Field of study is required.");
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!endDate) {
      setError("End date is required.");
      return;
    }

    try {
      setLoading(true);

      const educationData = {
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: endDate,
        description,
        is_published: isPublished,
      };

      let savedEducation;

      if (isEditing) {
        savedEducation = await updateEducation(
          education.id,
          educationData
        );
      } else {
        savedEducation = await createEducation(educationData);
      }

      onSaved(savedEducation);
      onClose();
    } catch (error) {
      console.error("Failed to save education:", error);
      setError(error.message || "Failed to save education.");
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
              {isEditing ? "EDIT EDUCATION" : "NEW EDUCATION"}
            </p>

            <h2>
              {isEditing ? "Edit Education" : "Add Education"}
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
            <label>Institution *</label>

            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. XYZ University"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Degree *</label>

              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech"
              />
            </div>

            <div className="form-group">
              <label>Field of Study *</label>

              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Engineering"
              />
            </div>
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
              <label>End Date *</label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your education..."
              rows="4"
            />
          </div>

          <div className="publish-toggle">
            <div>
              <strong>Publish Education</strong>

              <span>
                Published education can appear on your public portfolio.
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
                : "Create Education"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EducationModal;