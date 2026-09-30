
"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/api";
import "./Footer.css";

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setTimeout(() => {
          setFormSubmitted(false);
          setShowContactModal(false);
        }, 2200);
      } else {
        const errorData = await res.json().catch(() => ({}));

        setSubmitError(
          errorData.message ||
            "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to submit contact message", error);

      setSubmitError(
        "Network error: Could not reach the server. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-section" id="contact">
      <div className="footer-container">

        {/* =====================================================
            SOCIAL ICONS
        ====================================================== */}
        <div className="footer-social-row">

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-box"
            aria-label="Instagram"
          >
            <div className="social-box-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.1"
                  fill="currentColor"
                />
              </svg>
            </div>
          </a>

          {/* GITHUB */}
          <a
            href="https://github.com/afsallll005-cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-box"
            aria-label="GitHub"
          >
            <div className="social-box-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.167 8.839 21.49C9.339 21.581 9.5 21.272 9.5 21.002C9.5 20.761 9.491 20.122 9.487 19.292C6.726 19.892 6.139 17.959 6.139 17.959C5.685 16.808 5.03 16.5 5.03 16.5C4.121 15.878 5.1 15.891 5.1 15.891C6.105 15.962 6.634 16.923 6.634 16.923C7.527 18.453 8.974 18.014 9.52 17.752C9.61 17.106 9.87 16.666 10.157 16.416C7.954 16.165 5.638 15.316 5.638 11.316C5.638 10.174 6.046 9.24 6.715 8.507C6.601 8.253 6.245 7.194 6.813 5.753C6.813 5.753 7.659 5.482 9.49 6.72C10.292 6.497 11.15 6.386 12 6.382C12.85 6.386 13.708 6.497 14.51 6.72C16.34 5.482 17.185 5.753 17.185 5.753C17.754 7.194 17.398 8.253 17.284 8.507C17.954 9.24 18.36 10.174 18.36 11.316C18.36 15.327 16.04 16.162 13.83 16.408C14.19 16.719 14.51 17.33 14.51 18.263C14.51 19.599 14.498 20.676 14.498 21.002C14.498 21.275 14.658 21.586 15.165 21.489C19.138 20.165 22 16.417 22 12C22 6.477 17.523 2 12 2Z"
                />
              </svg>
            </div>
          </a>

          {/* LINKEDIN */}
          <a
            href="https://www.linkedin.com/in/mohammed-afsal-8a52b23aa"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-box"
            aria-label="LinkedIn"
          >
            <div className="social-box-icon">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.45 20.45H16.9V14.88C16.9 13.55 16.87 11.84 15.04 11.84C13.18 11.84 12.9 13.29 12.9 14.78V20.45H9.35V9H12.75V10.56H12.8C13.27 9.66 14.43 8.71 16.17 8.71C19.76 8.71 20.45 11.07 20.45 14.14V20.45ZM5.34 7.43C4.2 7.43 3.28 6.51 3.28 5.37C3.28 4.23 4.2 3.31 5.34 3.31C6.48 3.31 7.4 4.23 7.4 5.37C7.4 6.51 6.48 7.43 5.34 7.43ZM7.12 20.45H3.56V9H7.12V20.45ZM22.22 0H1.77C0.79 0 0 0.77 0 1.72V22.28C0 23.23 0.79 24 1.77 24H22.22C23.2 24 24 23.23 24 22.28V1.72C24 0.77 23.2 0 22.22 0Z"
                />
              </svg>
            </div>
          </a>

        </div>

        {/* =====================================================
            LET'S TALK CTA
        ====================================================== */}
        <div className="footer-cta-wrapper">
          <button
            type="button"
            className="footer-lets-talk"
            onClick={() => setShowContactModal(true)}
          >
            <div className="lets-talk-track">
              <span className="lets-talk-text">
                Let's Talk
              </span>

              <span className="lets-talk-text lets-talk-hover">
                Let's Talk
              </span>
            </div>

            <div className="lets-talk-arrow">
              <svg
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
              </svg>
            </div>
          </button>
        </div>

        {/* =====================================================
            BOTTOM METADATA BAR
        ====================================================== */}
        <div className="footer-bottom-bar">

          <div className="footer-email">
            <a
              href="mailto:hello@mhdafsal.com"
              className="email-link"
            >
              hello@mhdafsal.com
            </a>
          </div>

          <div
            className="footer-copyright"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <p>
              © {new Date().getFullYear()} Mhdafsal,
              All Rights Reserved
            </p>

            <Link
              href="/Admin"
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#3b82f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "rgba(255,255,255,0.4)")
              }
            >
              Admin ↗
            </Link>
          </div>

        </div>
      </div>

      {/* =====================================================
          CONTACT MODAL
      ====================================================== */}
      {showContactModal && (
        <div
          className="contact-modal-backdrop"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="contact-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowContactModal(false)}
              aria-label="Close form"
            >
              ✕
            </button>

            <h3 className="contact-modal-title">
              Start a Project
            </h3>

            <p className="contact-modal-sub">
              Have an exciting idea or need a design partner?
              Send a note below.
            </p>

            {formSubmitted ? (
              <div className="form-success-message">

                <span className="success-icon">
                  ✓
                </span>

                <h4>
                  Message Received!
                </h4>

                <p>
                  Thank you for reaching out.
                  We will respond within 24 hours.
                </p>

              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="contact-form"
              >

                {submitError && (
                  <div
                    style={{
                      padding: "0.6rem 0.8rem",
                      backgroundColor:
                        "rgba(239, 68, 68, 0.15)",
                      border:
                        "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "6px",
                      color: "#f87171",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Your Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Project Details
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Describe your vision, goals, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Sending Message..."
                    : "Send Message →"}
                </button>

              </form>
            )}

          </div>
        </div>
      )}
    </footer>
  );
}
