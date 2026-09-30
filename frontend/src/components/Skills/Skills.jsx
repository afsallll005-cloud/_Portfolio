"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/api";
import "./Skills.css";

const defaultSkills = [
  { _id: "1", name: "React / Next.js", category: "Frontend", level: 95 },
  { _id: "2", name: "UI/UX & Figma", category: "Design", level: 90 },
  { _id: "3", name: "JavaScript / TypeScript", category: "Frontend", level: 92 },
  { _id: "4", name: "Node.js & Express", category: "Backend", level: 85 },
  { _id: "5", name: "MongoDB", category: "Database", level: 80 },
  { _id: "6", name: "Framer & Animations", category: "Design", level: 88 },
];

export default function Skills() {
  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skills`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSkills(data);
          }
        }
      } catch (error) {
        console.warn("Could not fetch dynamic skills from backend, using fallbacks.", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        <div className="skills-header">
          <h2 className="skills-title">Skills & Capabilities</h2>
          <p className="skills-subtitle">
            A breakdown of my technical stack, creative tools, and core design competencies.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill._id || skill.name}>
              <div className="skill-card-top">
                <div className="skill-info-left">
                  <div className="skill-icon-wrap">
                    {skill.icon ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="skill-icon-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="skill-initial">{skill.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="skill-name-text">{skill.name}</h3>
                    <span className="skill-category-tag">{skill.category}</span>
                  </div>
                </div>

                <span className="skill-percentage-text">{skill.level || 85}%</span>
              </div>

              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{
                    width: `${skill.level || 85}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}