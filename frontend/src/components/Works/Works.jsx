
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
             * In a 5-column grid, 10 projects
             * (2 full rows of 5) are displayed initially.
             */
            const initialCount = 10;
            const mainProjectsList = data
              .slice(0, initialCount)
              .map(formatProject);

            const additional = data
              .slice(initialCount)
              .map(formatProject);

            setMainProjects(mainProjectsList);
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
              WORKS HEADER
          ================================================== */}
          <div className="works-header">
            <div className="works-eyebrow">
              <span className="works-eyebrow-line" aria-hidden="true" />
              <span className="works-eyebrow-text">WORKS</span>
            </div>
            <h2 className="works-heading">
              Designing visuals that people<br />
              actually <span className="works-heading-accent">want to look at.</span>
            </h2>
          </div>

          {/* =================================================
              PROJECT GRID (5-COLUMN VISUAL POSTERS)
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
                      PROJECT POSTER IMAGE
                  ========================================== */}

                  <div className="project-image-wrapper">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/works(1).png";
                      }}
                    />

                    {/* HOVER OVERLAY */}
                    <div className="project-overlay">
                      <span className="project-overlay-title">{project.title}</span>
                      <span className="project-overlay-btn" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
                          <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                        </svg>
                      </span>
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
                  <span>Discuss Project</span>
                  <span className="modal-btn-arrow" aria-hidden="true">→</span>
                </a>


                {/* LIVE SITE */}

                {selectedProject.link &&
                  selectedProject.link !== "#" && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn-secondary"
                    >
                      <span>Visit Live Site</span>
                      <span className="modal-btn-arrow" aria-hidden="true">↗</span>
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
