"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setError("Could not connect to backend server. Make sure your server is running on port 5000.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchProjects(); // Refresh list
        } else {
          alert("Failed to delete project");
        }
      } catch (err) {
        console.error("Failed to delete project", err);
        alert("Error connecting to server to delete project");
      }
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Projects</h1>
          <p className="admin-subtitle">
            The first 4 projects automatically appear on your main homepage grid. Additional projects automatically move to the "Load More" section.
          </p>
        </div>

        <Link href="/Admin/projects/new" className="btn-primary">
          <FiPlus /> Add Project
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
        <p style={{ color: "#8b92a5" }}>Loading projects...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Type</th>
                <th>Display Placement</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                const isMainGrid = index < 4;
                return (
                  <tr key={project._id || index}>
                    <td style={{ fontWeight: 700, color: isMainGrid ? "#3b82f6" : "#a855f7" }}>
                      #{index + 1}
                    </td>
                    <td>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="table-thumbnail"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {project.title}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: "6px", color: "#60a5fa" }}
                          title="Open external link"
                        >
                          <FiExternalLink size={12} />
                        </a>
                      )}
                    </td>
                    <td style={{ color: "#8b92a5" }}>{project.type}</td>
                    <td>
                      {isMainGrid ? (
                        <span
                          className="badge-tag"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                            color: "#60a5fa",
                            borderColor: "rgba(59, 130, 246, 0.3)",
                            fontWeight: 600,
                          }}
                        >
                          Main Grid (Slot {index + 1})
                        </span>
                      ) : (
                        <span
                          className="badge-tag"
                          style={{
                            backgroundColor: "rgba(168, 85, 247, 0.15)",
                            color: "#c084fc",
                            borderColor: "rgba(168, 85, 247, 0.3)",
                          }}
                        >
                          Load More (Slot {index + 1})
                        </span>
                      )}
                    </td>
                    <td>
                      {project.tags &&
                        project.tags.map((t) => (
                          <span key={t} className="badge-tag">
                            {t}
                          </span>
                        ))}
                    </td>
                    <td>
                      <Link
                        href={`/Admin/projects/edit/${project._id}`}
                        className="btn-edit"
                        title="Edit project"
                      >
                        <FiEdit2 /> Edit
                      </Link>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="btn-danger"
                        title="Delete project"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "3rem", color: "#6c7385" }}>
                    No projects found. Click "Add Project" to create your first one.
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
