"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        const data = await res.json();
        const featured = data.filter(p => p.isFeatured).slice(0, 3);
        setProjects(featured.length > 0 ? featured : data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <section
      className="projects-section"
      id="projects"
    >

      {/* Heading */}

      <div className="projects-heading">

        <div>

          <span className="section-label">
            SELECTED WORK
          </span>

          <h2>
            PROJECTS
          </h2>

        </div>


        <p>
          A selection of projects I've designed,
          developed and brought to life.
        </p>

      </div>


      {/* Project Grid */}

      <div className="project-grid">

        {projects.map((project) => (

          <article
            className="project-card"
            key={project._id || project.numberId}
          >

            <div className="project-number">
              {project.numberId}
            </div>


            <div className="project-image">

              <img
                src={project.image}
                alt={project.title}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

              <div className="project-placeholder">
                {project.title.split(" ")[0]}
              </div>

            </div>


            <div className="project-info">

              <div>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.tags && project.tags.length > 0 ? project.tags.join(', ') : project.type}
                </p>

              </div>


              <span className="project-arrow">
                ↗
              </span>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}