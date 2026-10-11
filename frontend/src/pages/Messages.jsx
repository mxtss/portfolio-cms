import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getMessages,
  updateMessage,
  deleteMessage,
} from "../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError(error.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);

    // Mark unread message as read
    if (!message.is_read) {
      try {
        const updatedMessage = await updateMessage(message.id, {
          ...message,
          is_read: true,
        });

        setMessages((currentMessages) =>
          currentMessages.map((item) =>
            item.id === updatedMessage.id
              ? updatedMessage
              : item
          )
        );

        setSelectedMessage(updatedMessage);
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      await deleteMessage(id);

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== id)
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />

        <section className="dashboard-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">INBOX</p>

              <h2>Messages</h2>

              <p className="page-description">
                Messages received through your portfolio contact form.
              </p>
            </div>

            {messages.length > 0 && (
              <div className="message-count">
                {unreadCount} unread
              </div>
            )}
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading messages...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">♡</div>

                <h3>No messages yet</h3>

                <p>
                  Messages submitted through your portfolio
                  contact form will appear here.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            messages.length > 0 && (
              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-card ${
                      message.is_read ? "read" : "unread"
                    }`}
                    onClick={() => handleOpenMessage(message)}
                  >
                    <div className="message-avatar">
                      {message.name
                        ? message.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    <div className="message-main">
                      <div className="message-top">
                        <div>
                          <strong>{message.name}</strong>

                          <span className="message-email">
                            {message.email}
                          </span>
                        </div>

                        <span className="message-date">
                          {formatDate(message.created_at)}
                        </span>
                      </div>

                      <h3>{message.subject}</h3>

                      <p>
                        {message.message.length > 120
                          ? `${message.message.substring(0, 120)}...`
                          : message.message}
                      </p>
                    </div>

                    <div className="message-side">
                      {!message.is_read && (
                        <span className="unread-dot"></span>
                      )}

                      <button
                        className="action-button delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>
      </main>

      {selectedMessage && (
        <div
          className="modal-overlay"
          onClick={handleCloseMessage}
        >
          <div
            className="project-modal message-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">MESSAGE</p>

                <h2>{selectedMessage.subject}</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={handleCloseMessage}
              >
                ×
              </button>
            </div>

            <div className="message-detail">
              <div className="message-detail-row">
                <span>From</span>

                <div>
                  <strong>{selectedMessage.name}</strong>

                  <a href={`mailto:${selectedMessage.email}`}>
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div className="message-detail-row">
                <span>Received</span>

                <strong>
                  {formatDate(selectedMessage.created_at)}
                </strong>
              </div>

              <div className="message-content">
                <span>Message</span>

                <p>{selectedMessage.message}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleCloseMessage}
              >
                Close
              </button>

              <button
                type="button"
                className="action-button delete"
                onClick={() =>
                  handleDelete(selectedMessage.id)
                }
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;