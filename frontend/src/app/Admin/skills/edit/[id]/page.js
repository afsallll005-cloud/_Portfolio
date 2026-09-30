"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiSave, FiX, FiImage } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function EditSkill() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    icon: "",
    level: 85,
  });

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skills/${id}`);
        if (res.ok) {
          const skill = await res.json();
          setFormData({
            name: skill.name || "",
            category: skill.category || "Frontend",
            icon: skill.icon || "",
            level: skill.level || 85,
          });
        } else {
          setError("Skill not found");
        }
      } catch (err) {
        console.error("Failed to fetch skill details", err);
        setError("Error connecting to server to load skill.");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/Admin/skills");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Error updating skill");
      }
    } catch (err) {
      console.error("Failed to update skill", err);
      setError("Network error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p style={{ color: "#8b92a5" }}>Loading skill details...</p>;
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Edit Skill</h1>
          <p className="admin-subtitle">Update skill name, category, or proficiency</p>
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
              {loading ? "Updating..." : "Update Skill"}
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
