
"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import "./Works.css";

export default function Works() {
  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [mainProjects, setMainProjects] = useState([]);
  const [moreProjects, setMoreProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH PROJECTS
  ========================================================= */

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/projects`);

        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            const formatProject = (p, idx) => ({
              id: p._id || p.numberId || idx,

              title: p.title || "Untitled Project",

              category:
                p.type || "Design & Development",

              image:
                p.image ||
                "/images/project-placeholder.jpg",

              tags: Array.isArray(p.tags)
                ? p.tags
                : p.tags
                ? p.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : ["Design", "Development"],

              year: p.year || "2025",

              description:
                p.description ||
                p.type ||
                "A bespoke digital experience crafted with precision and modern design standards.",

              link: p.link || "#",
            });

            /*
             * First 4 projects
             * are displayed initially.
             *
             * Newest projects should be returned
             * first from your backend.
             */
            const mainFour = data
              .slice(0, 4)
              .map(formatProject);

            /*
             * 5th, 6th, 7th...
             * automatically go to Load More.
             */
            const additional = data
              .slice(4)
              .map(formatProject);

            setMainProjects(mainFour);
            setMoreProjects(additional);
          } else {
            setMainProjects([]);
            setMoreProjects([]);
          }
        } else {
          setMainProjects([]);
          setMoreProjects([]);
        }
      } catch (err) {
        console.warn(
          "Could not fetch projects from backend:",
          err
        );

        setMainProjects([]);
        setMoreProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* =========================================================
     DISPLAYED PROJECTS
  ========================================================= */

  const displayedProjects = showMore
    ? [...mainProjects, ...moreProjects]
    : mainProjects;

  /* =========================================================
     CLOSE MODAL & ESCAPE LISTENER
  ========================================================= */

  const closeModal = () => {
    setSelectedProject(null);
  };

  useEffect(() => {
    if (!selectedProject) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          WORKS SECTION
      ====================================================== */}

      <section className="works-section" id="works">
        <div className="works-container">

          {/* =================================================
              PROJECT GRID
          ================================================== */}

          {displayedProjects.length > 0 ? (
            <div className="works-grid">

              {displayedProjects.map((project) => (
                <article
                  key={project.id}
                  className="project-card"
                  onClick={() =>
                    setSelectedProject(project)
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={`Open details for ${project.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                >

                  {/* =========================================
                      PROJECT IMAGE
                  ========================================== */}

                  <div className="project-image-wrapper">
                    <div className="project-image-inner">

                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/works(1).png";
                        }}
                      />

                      {/* =====================================
                          PROJECT OVERLAY & PROPER VIEW BUTTON
                      ====================================== */}

                      <div className="project-overlay">

                        <div
                          className="project-view-btn"
                          aria-label={`View ${project.title}`}
                        >
                          <span className="project-view-text">View</span>
                          <span className="project-view-arrow" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                              <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                            </svg>
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* =========================================
                      PROJECT TITLE & META
                  ========================================== */}

                  <div className="project-info">

                    <div className="project-text-content">
                      <div className="project-title-track">
                        <h4 className="project-title-text">
                          {project.title}
                        </h4>

                        <h4
                          className="
                            project-title-text
                            project-title-hover
                          "
                        >
                          {project.title}
                        </h4>
                      </div>

                      {project.category && (
                        <p className="project-category-tag">
                          {project.category}
                        </p>
                      )}
                    </div>

                    <div className="project-corner-arrow" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                      </svg>
                    </div>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            /* ===============================================
               EMPTY / LOADING STATE
            ================================================ */

            <div className="works-empty-state">
              {loading ? (
                <div className="works-loading-wrap">
                  <div className="works-spinner" aria-hidden="true" />
                  <p>Loading projects...</p>
                </div>
              ) : (
                <div className="works-empty-wrap">
                  <p className="works-empty-title">No projects published yet.</p>
                  <p className="works-empty-desc">
                    Add your projects via the Admin Panel.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =================================================
              LOAD MORE
          ================================================== */}

          {moreProjects.length > 0 && (
            <div className="works-cta-container">

              <button
                type="button"
                className="load-more-btn"
                onClick={() =>
                  setShowMore((prev) => !prev)
                }
                aria-label={
                  showMore
                    ? "Show fewer projects"
                    : "Load more projects"
                }
              >
                <span>
                  {showMore
                    ? "Show Less"
                    : `Load More (${moreProjects.length})`}
                </span>
              </button>

            </div>
          )}

        </div>
      </section>


      {/* =====================================================
          PROJECT DETAILS MODAL
      ====================================================== */}

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} project details`}
        >

          <div
            className="project-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ===============================================
                CLOSE BUTTON
            ================================================ */}

            <button
              type="button"
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close project details"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>


            {/* ===============================================
                MODAL IMAGE
            ================================================ */}

            <div className="modal-img-wrapper">

              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                onError={(e) => {
                  e.currentTarget.src = "/images/works(1).png";
                }}
              />

            </div>


            {/* ===============================================
                MODAL DETAILS
            ================================================ */}

            <div className="modal-details">

              {/* TAGS + YEAR */}

              <div className="modal-tags">

                {selectedProject.tags &&
                  selectedProject.tags.map(
                    (tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="modal-tag"
                      >
                        {tag}
                      </span>
                    )
                  )}

                {selectedProject.year && (
                  <span className="modal-year">
                    {selectedProject.year}
                  </span>
                )}

              </div>


              {/* TITLE */}

              <h2 className="modal-title">
                {selectedProject.title}
              </h2>


              {/* CATEGORY */}

              <p className="modal-category">
                {selectedProject.category}
              </p>


              {/* DESCRIPTION */}

              <p className="modal-desc">
                {selectedProject.description}
              </p>


              {/* =============================================
                  ACTION BUTTONS
              ============================================== */}

              <div className="modal-actions">

                {/* DISCUSS PROJECT */}

                <a
                  href="#contact"
                  className="modal-btn-primary"
                  onClick={closeModal}
                >
                  Discuss Project
                </a>


                {/* LIVE SITE */}

                {selectedProject.link &&
                  selectedProject.link !== "#" && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn-primary"
                      style={{
                        backgroundColor: "transparent",
                        border:
                          "1px solid rgba(255, 255, 255, 0.3)",
                        color: "#ffffff",
                      }}
                    >
                      Visit Live Site ↗
                    </a>
                  )}

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
