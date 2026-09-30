"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiSave,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiLink,
} from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function HeroAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "MHDAFSAL",
    subtitle: "I’m Specialized in Creating Website Design.",
    image: "./images/glitchme.jpeg",
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hero`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.message) {
          setFormData({
            title: data.title || "MHDAFSAL",
            subtitle: data.subtitle || "I’m Specialized in Creating Website Design.",
            image: data.image || "./images/glitchme.jpeg",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch hero content", error);
      setNotification({
        type: "error",
        text: "Could not fetch current hero data from backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert uploaded image file to optimized Base64 data URL
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, etc.).");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Optimize dimensions if image is larger than 1600px
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        setFormData((prev) => ({
          ...prev,
          image: dataUrl,
        }));
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const res = await fetch(`${API_BASE_URL}/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setNotification({
          type: "success",
          text: "Hero section and profile image updated successfully! The live website reflects these changes.",
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: "error",
          text: "Server error occurred while updating hero section.",
        });
      }
    } catch (error) {
      console.error("Failed to update hero", error);
      setNotification({
        type: "error",
        text: "Network error: Failed to connect to backend server.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Hero Section</h1>
          <p className="admin-subtitle">
            Configure the main title, headline subtitle, and profile card image displayed on your hero banner.
          </p>
        </div>
      </div>

      {notification && (
        <div className={`alert-banner ${notification.type}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {notification.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#8b92a5" }}>Loading hero content...</p>
      ) : (
        <div className="admin-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Hero Main Title (Your Brand Name)</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. MHDAFSAL"
                required
              />
              <span className="form-hint">Displayed in massive typography at the bottom of the hero</span>
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle / Headline</label>
              <textarea
                name="subtitle"
                className="form-textarea"
                rows="3"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. I’m Specialized in Creating Website Design."
                required
              />
            </div>

            {/* Profile Card Image Upload Area */}
            <div className="form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <label className="form-label" style={{ margin: 0 }}>
                  Profile Card Image (File Upload)
                </label>
                <button
                  type="button"
                  onClick={() => setUseUrlInput(!useUrlInput)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#60a5fa",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {useUrlInput ? (
                    <>
                      <FiUploadCloud /> Switch to File Upload
                    </>
                  ) : (
                    <>
                      <FiLink /> Or enter image URL
                    </>
                  )}
                </button>
              </div>

              {!useUrlInput ? (
                /* Drag & Drop File Upload Box */
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed #2a2e3b",
                      borderRadius: "12px",
                      padding: "2rem",
                      textAlign: "center",
                      backgroundColor: "#0b0c0f",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2a2e3b";
                      e.currentTarget.style.backgroundColor = "#0b0c0f";
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(59, 130, 246, 0.12)",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        fontSize: "1.5rem",
                      }}
                    >
                      <FiUploadCloud />
                    </div>

                    <h4 style={{ margin: "0 0 6px", fontSize: "1rem", color: "#f1f3f7" }}>
                      {fileName ? `Selected: ${fileName}` : "Click to browse or drag & drop image"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#8b92a5" }}>
                      Supports JPG, PNG, WEBP (Automatically processed & previewed)
                    </p>
                  </div>
                </div>
              ) : (
                /* Alternate URL Input */
                <div>
                  <input
                    type="text"
                    name="image"
                    className="form-input"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://... or ./images/glitchme.jpeg"
                  />
                  <span className="form-hint">Enter direct web URL or local static asset path</span>
                </div>
              )}

              {/* Live Preview Box */}
              {formData.image && (
                <div
                  className="image-preview-container"
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "#0b0c0f",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <img
                    src={formData.image}
                    alt="Hero Profile Preview"
                    style={{
                      width: "80px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #1f222a",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "./images/glitchme.jpeg";
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FiCheckCircle color="#34d399" /> Current Profile Image Preview
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#8b92a5" }}>
                      This picture is displayed on your hero 3D tilted profile card.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        marginTop: "8px",
                        background: "rgba(59, 130, 246, 0.15)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        color: "#60a5fa",
                        borderRadius: "6px",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FiRefreshCw size={12} /> Replace Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: "2rem" }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                <FiSave />
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
