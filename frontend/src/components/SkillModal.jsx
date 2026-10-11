import { useEffect, useState } from "react";
import { createSkill, updateSkill } from "../services/api";

function SkillModal({ skill, onClose, onSaved }) {
  const isEditing = Boolean(skill);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proficiency, setProficiency] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (skill) {
      setName(skill.name || "");
      setCategory(skill.category || "");
      setProficiency(skill.proficiency ?? 0);
      setIsPublished(skill.is_published || false);
    } else {
      setName("");
      setCategory("");
      setProficiency(0);
      setIsPublished(false);
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }

    if (!category.trim()) {
      setError("Skill category is required.");
      return;
    }

    if (proficiency < 0 || proficiency > 100) {
      setError("Proficiency must be between 0 and 100.");
      return;
    }

    try {
      setLoading(true);

      const skillData = {
        name,
        category,
        proficiency: Number(proficiency),
        is_published: isPublished,
      };

      let savedSkill;

      if (isEditing) {
        savedSkill = await updateSkill(skill.id, skillData);
      } else {
        savedSkill = await createSkill(skillData);
      }

      onSaved(savedSkill);
      onClose();
    } catch (error) {
      console.error("Failed to save skill:", error);
      setError(error.message || "Failed to save skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="project-modal skill-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {isEditing ? "EDIT SKILL" : "NEW SKILL"}
            </p>

            <h2>
              {isEditing ? "Edit Skill" : "Add Skill"}
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
            <label>Skill Name *</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Python"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Programming"
            />
          </div>

          <div className="form-group">
            <label>
              Proficiency: {proficiency}%
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
            />
          </div>

          <div className="publish-toggle">
            <div>
              <strong>Publish Skill</strong>

              <span>
                Published skills can appear on your public portfolio.
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
                : "Create Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SkillModal;