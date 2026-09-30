"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiBriefcase,
  FiStar,
  FiMail,
  FiPlus,
  FiEdit2,
  FiLayers,
  FiZap,
  FiUser,
  FiExternalLink,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    mainProjects: 0,
    moreProjects: 0,
    skills: 0,
    contacts: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(null); // true | false | null
  const [serverErrorDetails, setServerErrorDetails] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setServerErrorDetails(null);
    try {
      const [projectsRes, skillsRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/projects`).catch(() => null),
        fetch(`${API_BASE_URL}/skills`).catch(() => null),
        fetch(`${API_BASE_URL}/contacts`).catch(() => null),
      ]);

      let projects = [];
      let skills = [];
      let contacts = [];

      if (projectsRes && projectsRes.ok) {
        const data = await projectsRes.json();
        if (Array.isArray(data)) projects = data;
      }
      if (skillsRes && skillsRes.ok) {
        const data = await skillsRes.json();
        if (Array.isArray(data)) skills = data;
      }
      if (contactsRes && contactsRes.ok) {
        const data = await contactsRes.json();
        if (Array.isArray(data)) contacts = data;
      }

      const isConnected = !!(
        (projectsRes && projectsRes.ok) ||
        (skillsRes && skillsRes.ok) ||
        (contactsRes && contactsRes.ok)
      );
      setServerOnline(isConnected);

      if (!isConnected) {
        let errorMsg = null;
        if (projectsRes && !projectsRes.ok) {
          try {
            const errJson = await projectsRes.json();
            errorMsg = errJson.details || errJson.message || `HTTP ${projectsRes.status}`;
          } catch (_) {
            errorMsg = `HTTP ${projectsRes.status}`;
          }
        } else if (!projectsRes) {
          errorMsg = "Network request failed. Backend may be offline or CORS blocked.";
        }
        setServerErrorDetails(errorMsg);
      }

      // Automatic placement: first 4 in main grid, remaining in load more
      const mainCount = Math.min(projects.length, 4);
      const moreCount = Math.max(0, projects.length - 4);

      setStats({
        totalProjects: projects.length,
        mainProjects: mainCount,
        moreProjects: moreCount,
        skills: skills.length,
        contacts: contacts.length,
      });

      setRecentProjects(projects.slice(0, 5));
      setRecentContacts(contacts.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Top Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard Overview</h1>
          <p className="admin-subtitle">
            Welcome back! Monitor and manage your portfolio content in real time.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {serverOnline !== null && (
            <span className={`status-badge ${serverOnline ? "online" : "offline"}`}>
              <span className="status-dot"></span>
              {serverOnline ? "Backend Connected" : "Backend Offline"}
            </span>
          )}

          <button
            onClick={fetchDashboardData}
            className="btn-secondary"
            title="Refresh dashboard data"
          >
            <FiRefreshCw className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {serverOnline === false && (
        <div className="alert-banner error" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FiAlertCircle size={20} />
            <span>
              <strong>Cannot connect to backend API ({API_BASE_URL}).</strong>{" "}
              {API_BASE_URL.includes("localhost")
                ? "Make sure your Node.js backend server is running on port 5000 and MongoDB is connected."
                : "Make sure your Vercel backend server is deployed and MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0)."}
            </span>
          </div>
          {serverErrorDetails && (
            <div style={{ marginLeft: "30px", fontSize: "0.85rem", opacity: 0.95, background: "rgba(0,0,0,0.15)", padding: "6px 10px", borderRadius: "6px", wordBreak: "break-all" }}>
              <strong>Error Details:</strong> {serverErrorDetails}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Projects</span>
            <div className="stat-card-icon-box blue">
              <FiBriefcase />
            </div>
          </div>
          <div className="stat-card-value">{loading ? "-" : stats.totalProjects}</div>
          <div className="stat-card-hint">
            {stats.totalProjects === 0
              ? "No projects added yet"
              : stats.totalProjects <= 4
              ? `${stats.totalProjects} in Main Grid (Slots 1–4)`
              : `4 in Main Grid • ${stats.totalProjects - 4} in Load More`}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Load More Queue</span>
            <div className="stat-card-icon-box purple">
              <FiLayers />
            </div>
          </div>
          <div className="stat-card-value">{loading ? "-" : stats.moreProjects}</div>
          <div className="stat-card-hint">Projects beyond the first 4</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Skills</span>
            <div className="stat-card-icon-box yellow">
              <FiZap />
            </div>
          </div>
          <div className="stat-card-value">{loading ? "-" : stats.skills}</div>
          <div className="stat-card-hint">Technical proficiencies</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Client Messages</span>
            <div className="stat-card-icon-box green">
              <FiMail />
            </div>
          </div>
          <div className="stat-card-value">{loading ? "-" : stats.contacts}</div>
          <div className="stat-card-hint">Inquiries received</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>
          Quick Actions
        </h2>
        <div className="quick-actions-grid">
          <Link href="/Admin/projects/new" className="quick-action-card">
            <div className="quick-action-icon">
              <FiPlus />
            </div>
            <div className="quick-action-text">
              <h4>Add New Project</h4>
              <p>Add a project to your portfolio</p>
            </div>
          </Link>

          <Link href="/Admin/projects" className="quick-action-card">
            <div className="quick-action-icon">
              <FiBriefcase />
            </div>
            <div className="quick-action-text">
              <h4>Manage All Projects</h4>
              <p>View, edit or reorder projects</p>
            </div>
          </Link>

          <Link href="/Admin/hero" className="quick-action-card">
            <div className="quick-action-icon">
              <FiStar />
            </div>
            <div className="quick-action-text">
              <h4>Edit Hero Section</h4>
              <p>Update title, subtitle & photo</p>
            </div>
          </Link>

          <Link href="/Admin/about" className="quick-action-card">
            <div className="quick-action-icon">
              <FiUser />
            </div>
            <div className="quick-action-text">
              <h4>Edit About Section</h4>
              <p>Update bio, portrait & socials</p>
            </div>
          </Link>

          <Link href="/Admin/skills/new" className="quick-action-card">
            <div className="quick-action-icon">
              <FiZap />
            </div>
            <div className="quick-action-text">
              <h4>Add Skill</h4>
              <p>Add capability or framework</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Projects & Recent Messages */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "1.75rem",
        }}
      >
        {/* Recent Projects */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
              Recent Projects
            </h2>
            <Link
              href="/Admin/projects"
              style={{
                fontSize: "0.85rem",
                color: "#3b82f6",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View All <FiExternalLink size={14} />
            </Link>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Placement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project, index) => {
                  const isMain = index < 4;
                  return (
                    <tr key={project._id || index}>
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
                      <td style={{ fontWeight: 600 }}>{project.title}</td>
                      <td style={{ color: "#8b92a5", fontSize: "0.85rem" }}>
                        {project.type}
                      </td>
                      <td>
                        <span
                          className="badge-tag"
                          style={{
                            backgroundColor: isMain
                              ? "rgba(59, 130, 246, 0.15)"
                              : "rgba(168, 85, 247, 0.15)",
                            color: isMain ? "#60a5fa" : "#c084fc",
                            fontWeight: 600,
                          }}
                        >
                          {isMain ? `Main Grid (#${index + 1})` : `Load More (#${index + 1})`}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/Admin/projects/edit/${project._id}`}
                          className="btn-edit"
                          title="Edit project"
                        >
                          <FiEdit2 size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {recentProjects.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "2rem", color: "#6c7385" }}
                    >
                      {loading ? "Loading projects..." : "No projects found in database."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
              Recent Client Inquiries
            </h2>
            <Link
              href="/Admin/contacts"
              style={{
                fontSize: "0.85rem",
                color: "#3b82f6",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View All <FiExternalLink size={14} />
            </Link>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{contact.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#8b92a5" }}>
                        {contact.email}
                      </div>
                    </td>
                    <td
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#cbd5e1",
                      }}
                    >
                      {contact.message}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "#8b92a5", whiteSpace: "nowrap" }}>
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString()
                        : "Recent"}
                    </td>
                  </tr>
                ))}
                {recentContacts.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "center", padding: "2rem", color: "#6c7385" }}
                    >
                      {loading
                        ? "Loading inquiries..."
                        : "No contact messages received yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
