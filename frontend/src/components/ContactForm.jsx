
import { useState } from "react";
import { submitContactMessage } from "../services/api";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      await submitContactMessage(formData);
      setSuccess("Your message has been sent successfully! ♡");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Unable to send your message.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-name">Your name *</label>
          <input
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="What should I call you?"
            required
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email address *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="contact-subject">Subject *</label>
        <input
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's on your mind?"
          required
          maxLength={200}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message *</label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me a little about what you'd like to discuss..."
          rows={6}
          required
        />
      </div>
      {error && (
        <p className="contact-feedback error-message" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="contact-success" role="status">
          {success}
        </p>
      )}
      <button
        className="primary-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message ♡"}
      </button>
    </form>
  );
}
export default ContactForm;