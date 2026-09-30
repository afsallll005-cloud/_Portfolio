"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiMail, FiCalendar, FiUser, FiEye, FiX, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Failed to fetch contacts", err);
      setError("Could not connect to backend server to load messages.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          if (selectedContact?._id === id) {
            setSelectedContact(null);
          }
          fetchContacts(); // Refresh list
        } else {
          alert("Failed to delete message");
        }
      } catch (err) {
        console.error("Failed to delete contact", err);
        alert("Error connecting to server to delete message");
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Client Inquiries</h1>
          <p className="admin-subtitle">
            Messages sent from the "Let's Talk" contact form on your portfolio website.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert-banner error">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#8b92a5" }}>Loading messages...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Email</th>
                <th>Message Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td style={{ whiteSpace: "nowrap", color: "#8b92a5", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiCalendar size={13} />
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString()
                        : "Recent"}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{contact.name}</td>
                  <td>
                    <a
                      href={`mailto:${contact.email}?subject=Re: Portfolio Inquiry`}
                      style={{
                        color: "#60a5fa",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      title="Send email reply"
                    >
                      <FiMail size={13} />
                      {contact.email}
                    </a>
                  </td>
                  <td
                    style={{
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#cbd5e1",
                    }}
                  >
                    {contact.message}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="btn-secondary"
                        style={{ padding: "0.4rem 0.75rem", fontSize: "0.82rem" }}
                        title="Read full message"
                      >
                        <FiEye size={13} /> Read
                      </button>
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="btn-danger"
                        title="Delete message"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#6c7385" }}>
                    No messages received yet. Messages submitted through the website will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedContact && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedContact(null)}
        >
          <div
            style={{
              backgroundColor: "#16181f",
              border: "1px solid #2a2e3b",
              borderRadius: "14px",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedContact(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                color: "#8b92a5",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              <FiX />
            </button>

            <h3 style={{ margin: "0 0 1rem", fontSize: "1.3rem", color: "#ffffff" }}>
              Inquiry Details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid #232733",
              }}
            >
              <div>
                <span style={{ fontSize: "0.78rem", color: "#8b92a5", textTransform: "uppercase" }}>
                  Sender Name
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: 600, color: "#fff" }}>
                  {selectedContact.name}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "#8b92a5", textTransform: "uppercase" }}>
                  Email Address
                </span>
                <p style={{ margin: "4px 0 0" }}>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    style={{ color: "#60a5fa", textDecoration: "none" }}
                  >
                    {selectedContact.email}
                  </a>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#8b92a5", textTransform: "uppercase" }}>
                Message
              </span>
              <div
                style={{
                  marginTop: "8px",
                  padding: "1rem",
                  backgroundColor: "#0b0c0f",
                  border: "1px solid #1f222a",
                  borderRadius: "8px",
                  lineHeight: 1.6,
                  color: "#e2e8f0",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedContact.message}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#6c7385" }}>
                Received on:{" "}
                {selectedContact.createdAt
                  ? new Date(selectedContact.createdAt).toLocaleString()
                  : "N/A"}
              </span>

              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your Inquiry on Mhdafsal Portfolio`}
                  className="btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  <FiMail /> Reply via Email
                </a>
                <button
                  onClick={() => deleteContact(selectedContact._id)}
                  className="btn-danger"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
