"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiSave,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiLink,
  FiUser,
  FiFileText,
  FiShare2,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function AboutAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [useResumeUrlInput, setUseResumeUrlInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    heading: "About Me",
    paragraph1:
      "I’m a designer focused on Website Design, Digital Product Design, and No-Code Development. I help individuals and businesses bring ideas to life through clean, modern, and functional design.",
    paragraph2:
      "With a strong eye for detail and a user-first mindset, I create websites and digital products that not only look great but also work seamlessly — combining aesthetic simplicity with exceptional performance.",
    image: "https://framerusercontent.com/images/Lwf11bejG2ckx3QD9tlBaUP3kE.jpg",
    resumeText: "View Resume",
    resumeLink: "#contact",
    resumeFile: "",
    resumeFileName: "",
    linkedinUrl: "https://www.linkedin.com/in/mohammed-afsal-8a52b23aa",
    githubUrl: "https://github.com/afsallll005-cloud",
    instagramUrl: "https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==",
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/about`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.message) {
          setFormData({
            heading: data.heading || "About Me",
            paragraph1: data.paragraph1 || "",
            paragraph2: data.paragraph2 || "",
            image: data.image || "https://framerusercontent.com/images/Lwf11bejG2ckx3QD9tlBaUP3kE.jpg",
            resumeText: data.resumeText || "View Resume",
            resumeLink: data.resumeLink || "#contact",
            resumeFile: data.resumeFile || "",
            resumeFileName: data.resumeFileName || "",
            linkedinUrl: data.linkedinUrl || "https://www.linkedin.com/in/mohammed-afsal-8a52b23aa",
            githubUrl: data.githubUrl || "https://github.com/afsallll005-cloud",
            instagramUrl: data.instagramUrl || "https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==",
          });
          if (data.resumeFile) {
            setUseResumeUrlInput(false);
          } else if (data.resumeLink && data.resumeLink !== "#contact") {
            setUseResumeUrlInput(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch about content", error);
      setNotification({
        type: "error",
        text: "Could not fetch current about data from backend.",
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

  // Process uploaded resume document (PDF, DOCX, DOC)
  const processResumeFile = (file) => {
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    const isValidDoc =
      fileNameLower.endsWith(".pdf") ||
      fileNameLower.endsWith(".docx") ||
      fileNameLower.endsWith(".doc");

    if (!isValidDoc) {
      alert("Please upload a PDF or Word document (.pdf, .docx, .doc).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("The selected file is larger than 20MB. Please select a smaller resume file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        resumeFile: e.target.result,
        resumeFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const handleResumeDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  const removeResumeFile = () => {
    setFormData((prev) => ({
      ...prev,
      resumeFile: "",
      resumeFileName: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const res = await fetch(`${API_BASE_URL}/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setNotification({
          type: "success",
          text: "About section updated successfully! The live portfolio reflects these changes.",
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: "error",
          text: "Server error occurred while updating About section.",
        });
      }
    } catch (error) {
      console.error("Failed to update about", error);
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
          <h1 className="admin-title">Manage About Section</h1>
          <p className="admin-subtitle">
            Configure your biography, introduction focus, portrait photo, resume link, and social profiles.
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
        <p style={{ color: "#8b92a5" }}>Loading about content...</p>
      ) : (
        <div className="admin-form-container">
          <form onSubmit={handleSubmit}>
            {/* Section Heading */}
            <div className="form-group">
              <label className="form-label">Section Heading</label>
              <input
                type="text"
                name="heading"
                className="form-input"
                value={formData.heading}
                onChange={handleChange}
                placeholder="e.g. About Me"
                required
              />
              <span className="form-hint">Displayed at the top of the About section</span>
            </div>

            {/* Paragraph 1: Focus Statement */}
            <div className="form-group">
              <label className="form-label">Introduction / Core Focus (Paragraph 1)</label>
              <textarea
                name="paragraph1"
                className="form-textarea"
                rows="4"
                value={formData.paragraph1}
                onChange={handleChange}
                placeholder="I’m a designer focused on Website Design, Digital Product Design, and No-Code Development..."
                required
              />
              <span className="form-hint">
                Introduces your professional focus and what you help clients achieve
              </span>
            </div>

            {/* Paragraph 2: Philosophy & Mindset */}
            <div className="form-group">
              <label className="form-label">Approach & Philosophy (Paragraph 2)</label>
              <textarea
                name="paragraph2"
                className="form-textarea"
                rows="4"
                value={formData.paragraph2}
                onChange={handleChange}
                placeholder="With a strong eye for detail and a user-first mindset, I create websites and digital products..."
                required
              />
              <span className="form-hint">
                Describes your design mindset, work philosophy, and aesthetic standards
              </span>
            </div>

            {/* Portrait Image Upload */}
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
                  About Portrait Image (File Upload)
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
                      {fileName ? `Selected: ${fileName}` : "Click to browse or drag & drop portrait image"}
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
                    placeholder="https://... or /images/about-portrait.jpg"
                  />
                  <span className="form-hint">Enter direct web URL or static asset path</span>
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
                    alt="About Portrait Preview"
                    style={{
                      width: "80px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #1f222a",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://framerusercontent.com/images/Lwf11bejG2ckx3QD9tlBaUP3kE.jpg";
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
                      <FiCheckCircle color="#34d399" /> Current About Portrait Preview
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#8b92a5" }}>
                      This portrait image is displayed alongside your biography.
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

            {/* Resume Button & Document Upload Settings */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #1a1d24" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, margin: 0, color: "#ffffff" }}>
                    Resume Document & CTA Button
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#8b92a5" }}>
                    Upload your resume file (PDF) or configure an external URL / #contact scroll target
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseResumeUrlInput(!useResumeUrlInput)}
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
                  {useResumeUrlInput ? (
                    <>
                      <FiUploadCloud /> Switch to Resume File Upload
                    </>
                  ) : (
                    <>
                      <FiLink /> Or enter Link / #contact
                    </>
                  )}
                </button>
              </div>

              {/* Button Label */}
              <div className="form-group" style={{ maxWidth: "340px", marginBottom: "1.25rem" }}>
                <label className="form-label">Resume Button Label</label>
                <input
                  type="text"
                  name="resumeText"
                  className="form-input"
                  value={formData.resumeText}
                  onChange={handleChange}
                  placeholder="View Resume"
                  required
                />
              </div>

              {!useResumeUrlInput ? (
                /* Resume File Upload Mode */
                <div className="form-group">
                  <label className="form-label">Upload Resume Document (PDF, DOCX)</label>

                  <input
                    type="file"
                    ref={resumeFileInputRef}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeFileChange}
                    style={{ display: "none" }}
                  />

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleResumeDrop}
                    onClick={() => resumeFileInputRef.current?.click()}
                    style={{
                      border: "2px dashed #2a2e3b",
                      borderRadius: "12px",
                      padding: "1.75rem",
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
                      <FiFileText />
                    </div>

                    <h4 style={{ margin: "0 0 6px", fontSize: "0.95rem", color: "#f1f3f7" }}>
                      {formData.resumeFileName
                        ? `Selected: ${formData.resumeFileName}`
                        : "Click to browse or drag & drop Resume file"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#8b92a5" }}>
                      Supports PDF, DOC, DOCX documents (Recommended: PDF)
                    </p>
                  </div>

                  {/* Uploaded Resume Card / Status */}
                  {formData.resumeFile && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.85rem 1.15rem",
                        backgroundColor: "#0b0c0f",
                        border: "1px solid #1f222a",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            color: "#34d399",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.1rem",
                          }}
                        >
                          <FiCheckCircle />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff" }}>
                            {formData.resumeFileName || "Uploaded Resume Document"}
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#10b981" }}>
                            Active • Available for one-click download on portfolio
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <a
                          href={formData.resumeFile}
                          download={formData.resumeFileName || "Resume.pdf"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.78rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiDownload /> Test Download
                        </a>

                        <button
                          type="button"
                          onClick={() => resumeFileInputRef.current?.click()}
                          style={{
                            background: "rgba(59, 130, 246, 0.15)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#60a5fa",
                            borderRadius: "6px",
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiRefreshCw size={12} /> Replace File
                        </button>

                        <button
                          type="button"
                          onClick={removeResumeFile}
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "0.4rem 0.75rem",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiTrash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Resume Target Link / #contact Mode */
                <div className="form-group">
                  <label className="form-label">Target Link (URL or #contact)</label>
                  <input
                    type="text"
                    name="resumeLink"
                    className="form-input"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="#contact or https://drive.google.com/..."
                    required
                  />
                  <span className="form-hint">
                    Use '#contact' to scroll to contact modal, or paste direct Google Drive / Dropbox link
                  </span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid #1a1d24" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem", color: "#ffffff" }}>
                Social Profile Shortcuts
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn (LN)</label>
                  <input
                    type="text"
                    name="linkedinUrl"
                    className="form-input"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/in/username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub (GH)</label>
                  <input
                    type="text"
                    name="githubUrl"
                    className="form-input"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instagram (IG)</label>
                  <input
                    type="text"
                    name="instagramUrl"
                    className="form-input"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
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
