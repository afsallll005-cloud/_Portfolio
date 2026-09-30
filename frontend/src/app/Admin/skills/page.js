"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/skills`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        setSkills([]);
      }
    } catch (err) {
      console.error("Failed to fetch skills", err);
      setError("Could not connect to backend server to load skills.");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/skills/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchSkills();
        } else {
          alert("Failed to delete skill");
        }
      } catch (err) {
        console.error("Failed to delete skill", err);
        alert("Error connecting to server to delete skill");
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Skills</h1>
          <p className="admin-subtitle">
            Configure your technical proficiencies, frameworks, and design capabilities.
          </p>
        </div>

        <Link href="/Admin/skills/new" className="btn-primary">
          <FiPlus /> Add New Skill
        </Link>
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
        <p style={{ color: "#8b92a5" }}>Loading skills...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {skill.icon ? (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            background: "rgba(59, 130, 246, 0.15)",
                            color: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                        >
                          {skill.name.charAt(0)}
                        </div>
                      )}
                      <span style={{ fontWeight: 600 }}>{skill.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-tag" style={{ textTransform: "capitalize" }}>
                      {skill.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "160px" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          backgroundColor: "#1f222a",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${skill.level || 85}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#8b92a5", width: "35px" }}>
                        {skill.level || 85}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <Link
                      href={`/Admin/skills/edit/${skill._id}`}
                      className="btn-edit"
                      title="Edit skill"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <button
                      onClick={() => deleteSkill(skill._id)}
                      className="btn-danger"
                      title="Delete skill"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "3rem", color: "#6c7385" }}>
                    No skills found. Click "Add New Skill" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
