"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiX, FiImage } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function NewMoreProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    tags: "",
    year: "2024",
    image: "",
    numberId: "",
    isFeatured: false, // More Projects are non-featured
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSubmit = {
        ...formData,
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
        router.push("/Admin/more-projects");
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
          <h1 className="admin-title">Add New More Project</h1>
          <p className="admin-subtitle">Create a project for your secondary works list</p>
        </div>

        <Link href="/Admin/more-projects" className="btn-secondary">
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
              <label className="form-label">Number ID (e.g. 05, 06)</label>
              <input
                type="text"
                name="numberId"
                className="form-input"
                value={formData.numberId}
                onChange={handleChange}
                placeholder="05"
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
                placeholder="e.g. Lumina AI"
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
                placeholder="e.g. Generative Media Engine"
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
                placeholder="2024"
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
              placeholder="AI Platform, Design System"
              required
            />
            <span className="form-hint">Separate multiple technologies with commas</span>
          </div>

          <div className="form-group">
            <label className="form-label">Image Path or URL</label>
            <input
              type="text"
              name="image"
              className="form-input"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/... or /images/works(1).png"
            />

            {formData.image && (
              <div className="image-preview-container">
                <span style={{ fontSize: "0.78rem", color: "#8b92a5", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiImage /> Live Image Preview:
                </span>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="image-preview-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
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
              placeholder="Describe the project, architecture, and design features..."
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
              placeholder="https://example.com"
            />
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSave />
              {loading ? "Saving Project..." : "Save Project"}
            </button>
            <Link href="/Admin/more-projects" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
