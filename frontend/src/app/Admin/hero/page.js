"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiSave,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiLink,
  FiMonitor,
  FiSmartphone,
  FiImage,
} from "react-icons/fi";
import { API_BASE_URL } from "@/utils/api";

export default function HeroAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', text: '' }

  // Laptop / Desktop image state
  const [useUrlDesktop, setUseUrlDesktop] = useState(false);
  const [desktopFileName, setDesktopFileName] = useState("");
  const desktopFileInputRef = useRef(null);

  // Mobile image state
  const [useUrlMobile, setUseUrlMobile] = useState(false);
  const [mobileFileName, setMobileFileName] = useState("");
  const mobileFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "MHDAFSAL",
    subtitle: "THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM.",
    desktopImage: "./images/glitchme.jpeg",
    mobileImage: "./images/glitchme.jpeg",
    searchPhrase: "Best website designer in Malappuram",
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
            subtitle: data.subtitle || "THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM.",
            desktopImage: data.desktopImage || data.image || "./images/glitchme.jpeg",
            mobileImage: data.mobileImage || data.desktopImage || data.image || "./images/glitchme.jpeg",
            searchPhrase: data.searchPhrase || "Best website designer in Malappuram",
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
  const processImageFile = (file, targetKey) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, etc.).");
      return;
    }

    if (targetKey === "desktopImage") {
      setDesktopFileName(file.name);
    } else {
      setMobileFileName(file.name);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Optimize dimensions (1920 for desktop, 1200 for mobile)
        const maxDimension = targetKey === "desktopImage" ? 1920 : 1200;
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
          [targetKey]: dataUrl,
        }));
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        desktopImage: formData.desktopImage,
        mobileImage: formData.mobileImage,
        image: formData.desktopImage, // backward compatibility
        searchPhrase: formData.searchPhrase,
      };

      const res = await fetch(`${API_BASE_URL}/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNotification({
          type: "success",
          text: "Hero section and responsive images (Laptop & Mobile) updated successfully! The live website reflects these changes.",
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
            Configure titles, typing headline intro, and dedicated responsive images for Laptop / Desktop and Mobile devices.
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
        <div className="admin-form-container" style={{ maxWidth: "1000px" }}>
          <form onSubmit={handleSubmit}>
            {/* Title & Headline Fields */}
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
              <span className="form-hint">Displayed in massive typography at the bottom of the hero banner</span>
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle / Headline</label>
              <textarea
                name="subtitle"
                className="form-textarea"
                rows="3"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM."
                required
              />
              <span className="form-hint">Displayed in bold Clash Display typography during the scroll zoom</span>
            </div>

            <div className="form-group">
              <label className="form-label">Search Intro Typing Phrase</label>
              <input
                type="text"
                name="searchPhrase"
                className="form-input"
                value={formData.searchPhrase || ""}
                onChange={handleChange}
                placeholder="e.g. Best website designer in Malappuram"
              />
              <span className="form-hint">Typed in the Google search bar overlay on page load</span>
            </div>

            {/* RESPONSIVE IMAGES SECTION (LAPTOP + MOBILE) */}
            <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#fff", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiImage color="#3b82f6" /> Hero Responsive Images (Laptop & Mobile)
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#8b92a5", margin: 0 }}>
                  Upload separate optimized images: widescreen landscape for laptops/desktops, and vertical portrait for mobile phones.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* 1. LAPTOP / DESKTOP IMAGE CARD */}
                <div
                  style={{
                    backgroundColor: "#0d0f14",
                    border: "1px solid #1f232e",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(59, 130, 246, 0.15)",
                          color: "#3b82f6",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <FiMonitor size={18} />
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#f1f3f7", fontWeight: 600 }}>
                          Laptop & Desktop Image
                        </h4>
                        <span style={{ fontSize: "0.75rem", color: "#60a5fa" }}>Wide Screens (16:9)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUseUrlDesktop(!useUrlDesktop)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {useUrlDesktop ? (
                        <>
                          <FiUploadCloud /> Upload
                        </>
                      ) : (
                        <>
                          <FiLink /> URL
                        </>
                      )}
                    </button>
                  </div>

                  <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "#8b92a5" }}>
                    Recommended: Landscape 16:9 ratio (e.g. 1920×1080 or 1600×900) for laptop & PC displays.
                  </p>

                  {!useUrlDesktop ? (
                    <div>
                      <input
                        type="file"
                        ref={desktopFileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processImageFile(file, "desktopImage");
                        }}
                        style={{ display: "none" }}
                      />

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) processImageFile(file, "desktopImage");
                        }}
                        onClick={() => desktopFileInputRef.current?.click()}
                        style={{
                          border: "2px dashed #2a2e3b",
                          borderRadius: "10px",
                          padding: "1.5rem 1rem",
                          textAlign: "center",
                          backgroundColor: "#07080a",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#3b82f6";
                          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#2a2e3b";
                          e.currentTarget.style.backgroundColor = "#07080a";
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(59, 130, 246, 0.12)",
                            color: "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                            fontSize: "1.3rem",
                          }}
                        >
                          <FiUploadCloud />
                        </div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#f1f3f7", fontWeight: 500 }}>
                          {desktopFileName ? `File: ${desktopFileName}` : "Click or drag Laptop image here"}
                        </p>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>JPG, PNG, WEBP supported</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        name="desktopImage"
                        className="form-input"
                        value={formData.desktopImage}
                        onChange={handleChange}
                        placeholder="https://... or ./images/glitchme.jpeg"
                      />
                      <span className="form-hint">Enter direct web URL or local static path</span>
                    </div>
                  )}

                  {/* Laptop Image Preview Mockup */}
                  {formData.desktopImage && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.85rem",
                        backgroundColor: "#07080a",
                        borderRadius: "10px",
                        border: "1px solid #1a1e27",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "110px",
                          aspectRatio: "16 / 9",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "1px solid #2d3342",
                          backgroundColor: "#000",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={formData.desktopImage}
                          alt="Laptop Hero Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "./images/glitchme.jpeg";
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiCheckCircle color="#34d399" size={13} /> Laptop View Ready
                        </span>
                        <p style={{ margin: "2px 0 6px", fontSize: "0.72rem", color: "#8b92a5" }}>
                          Used on screens ≥ 768px
                        </p>
                        <button
                          type="button"
                          onClick={() => desktopFileInputRef.current?.click()}
                          style={{
                            background: "rgba(59, 130, 246, 0.12)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#60a5fa",
                            borderRadius: "5px",
                            padding: "0.25rem 0.55rem",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiRefreshCw size={11} /> Replace
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MOBILE SMARTPHONE IMAGE CARD */}
                <div
                  style={{
                    backgroundColor: "#0d0f14",
                    border: "1px solid #1f232e",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          padding: "6px 8px",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <FiSmartphone size={18} />
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#f1f3f7", fontWeight: 600 }}>
                          Mobile Screen Image
                        </h4>
                        <span style={{ fontSize: "0.75rem", color: "#34d399" }}>Smartphones (4:5 Portrait)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUseUrlMobile(!useUrlMobile)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {useUrlMobile ? (
                        <>
                          <FiUploadCloud /> Upload
                        </>
                      ) : (
                        <>
                          <FiLink /> URL
                        </>
                      )}
                    </button>
                  </div>

                  <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "#8b92a5" }}>
                    Recommended: Portrait 4:5 or 9:16 vertical ratio (e.g. 1080×1350 or 1080×1920) for smartphone screens.
                  </p>

                  {!useUrlMobile ? (
                    <div>
                      <input
                        type="file"
                        ref={mobileFileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processImageFile(file, "mobileImage");
                        }}
                        style={{ display: "none" }}
                      />

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) processImageFile(file, "mobileImage");
                        }}
                        onClick={() => mobileFileInputRef.current?.click()}
                        style={{
                          border: "2px dashed #2a2e3b",
                          borderRadius: "10px",
                          padding: "1.5rem 1rem",
                          textAlign: "center",
                          backgroundColor: "#07080a",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#2a2e3b";
                          e.currentTarget.style.backgroundColor = "#07080a";
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                            fontSize: "1.3rem",
                          }}
                        >
                          <FiUploadCloud />
                        </div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#f1f3f7", fontWeight: 500 }}>
                          {mobileFileName ? `File: ${mobileFileName}` : "Click or drag Mobile image here"}
                        </p>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>JPG, PNG, WEBP supported</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        name="mobileImage"
                        className="form-input"
                        value={formData.mobileImage}
                        onChange={handleChange}
                        placeholder="https://... or ./images/glitchme.jpeg"
                      />
                      <span className="form-hint">Enter direct web URL or local static path</span>
                    </div>
                  )}

                  {/* Mobile Image Preview Mockup */}
                  {formData.mobileImage && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.85rem",
                        backgroundColor: "#07080a",
                        borderRadius: "10px",
                        border: "1px solid #1a1e27",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "75px",
                          aspectRatio: "4 / 5",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #2d3342",
                          backgroundColor: "#000",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={formData.mobileImage}
                          alt="Mobile Hero Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "./images/glitchme.jpeg";
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FiCheckCircle color="#10b981" size={13} /> Mobile View Ready
                        </span>
                        <p style={{ margin: "2px 0 6px", fontSize: "0.72rem", color: "#8b92a5" }}>
                          Used on screens &lt; 768px
                        </p>
                        <button
                          type="button"
                          onClick={() => mobileFileInputRef.current?.click()}
                          style={{
                            background: "rgba(16, 185, 129, 0.12)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            color: "#34d399",
                            borderRadius: "5px",
                            padding: "0.25rem 0.55rem",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiRefreshCw size={11} /> Replace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
