"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSave, FiX, FiImage } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function NewSkill() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    icon: "",
    level: 85,
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
      const res = await fetch(`${API_BASE_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/Admin/skills");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Error saving skill");
      }
    } catch (err) {
      console.error("Failed to create skill", err);
      setError("Network error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Add New Skill</h1>
          <p className="admin-subtitle">Add a technical capability or tool to your portfolio</p>
        </div>

        <Link href="/Admin/skills" className="btn-secondary">
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
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Next.js, Figma, TypeScript"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design / UI/UX</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools & Platforms</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency Level ({formData.level}%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                <input
                  type="range"
                  name="level"
                  min="20"
                  max="100"
                  step="5"
                  value={formData.level}
                  onChange={handleChange}
                  style={{ flex: 1, accentColor: "#3b82f6" }}
                />
                <span style={{ fontWeight: 600, color: "#60a5fa", minWidth: "40px" }}>
                  {formData.level}%
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Icon Path or URL (Optional)</label>
            <input
              type="text"
              name="icon"
              className="form-input"
              value={formData.icon}
              onChange={handleChange}
              placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg or /images/..."
            />

            {formData.icon && (
              <div className="image-preview-container">
                <span style={{ fontSize: "0.78rem", color: "#8b92a5", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiImage /> Live Icon Preview:
                </span>
                <img
                  src={formData.icon}
                  alt="Icon Preview"
                  style={{ width: "36px", height: "36px", objectFit: "contain" }}
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

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSave />
              {loading ? "Saving Skill..." : "Save Skill"}
            </button>
            <Link href="/Admin/skills" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
