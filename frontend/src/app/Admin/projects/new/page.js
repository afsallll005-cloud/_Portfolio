"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiSave,
  FiX,
  FiImage,
  FiUploadCloud,
  FiCheckCircle,
  FiRefreshCw,
  FiLink,
} from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    tags: "",
    year: "2025",
    image: "",
    numberId: "",
    link: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    setError("");

    if (!formData.image) {
      setError("Please upload or provide a project image.");
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        isFeatured: true, // Default active
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        router.push("/Admin/projects");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Error saving project");
      }
    } catch (err) {
      console.error("Failed to create project", err);
      setError("Network error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Add New Project</h1>
          <p className="admin-subtitle">
            Create a project. Projects 1–4 appear in the main grid; 5+ automatically appear in Load More.
          </p>
        </div>

        <Link href="/Admin/projects" className="btn-secondary">
          <FiX /> Cancel
        </Link>
      </div>

      {error && (
        <div className="alert-banner error">
          <span>{error}</span>
        </div>
      )}

      <div className="admin-form-container">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Number ID (e.g. 01, 02)</label>
              <input
                type="text"
                name="numberId"
                className="form-input"
                value={formData.numberId}
                onChange={handleChange}
                placeholder="01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Tasklflow Platform"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Type / Category</label>
              <input
                type="text"
                name="type"
                className="form-input"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g. Digital Product, E-Commerce, Web App"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="text"
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleChange}
                placeholder="2025"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, Next.js, UI/UX"
              required
            />
            <span className="form-hint">Separate technologies with commas</span>
          </div>

          {/* Project Image Upload Area */}
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
                Project Image (File Upload)
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
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                      color: "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                      fontSize: "1.4rem",
                    }}
                  >
                    <FiUploadCloud />
                  </div>

                  <h4 style={{ margin: "0 0 6px", fontSize: "0.95rem", color: "#f1f3f7" }}>
                    {fileName ? `Selected: ${fileName}` : "Click to browse or drag & drop project image"}
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
                  placeholder="https://... or /images/project.jpg"
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
                  padding: "0.85rem 1rem",
                  backgroundColor: "#0b0c0f",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <img
                  src={formData.image}
                  alt="Project Preview"
                  style={{
                    width: "110px",
                    height: "75px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #1f222a",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
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
                    <FiCheckCircle color="#34d399" /> Current Project Image Preview
                  </span>
                  <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#8b92a5" }}>
                    This image will appear on the portfolio grid and detail modal.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginTop: "6px",
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

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project goals, features, and key challenges (displayed in the detail modal)..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Live Project Link (Optional)</label>
            <input
              type="text"
              name="link"
              className="form-input"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://myproject.com"
            />
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSave />
              {loading ? "Saving Project..." : "Save Project"}
            </button>
            <Link href="/Admin/projects" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
