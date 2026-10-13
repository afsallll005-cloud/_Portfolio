"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL, DEFAULT_PRODUCTION_BACKEND } from "@/utils/api";
import "./About.css";

export default function About() {
  const [aboutData, setAboutData] = useState({
    heading: "About Me",
    paragraph1:
      "I’m a designer focused on Website Design, Digital Product Design, and No-Code Development. I help individuals and businesses bring ideas to life through clean, modern, and functional design.",
    paragraph2:
      "With a strong eye for detail and a user-first mindset, I create websites and digital products that not only look great but also work seamlessly — combining aesthetic simplicity with exceptional performance.",
    image: "./images/mee(1).png",
    resumeText: "View Resume",
    resumeLink: "#contact",
    resumeFile: "",
    resumeFileName: "",
    linkedinUrl: "https://www.linkedin.com/in/mohammed-afsal-8a52b23aa",
    githubUrl: "https://github.com/afsallll005-cloud",
    instagramUrl: "https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAbout = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/about`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && !data.message) {
            setAboutData((prev) => ({
              ...prev,
              ...data,
            }));
            return;
          }
        }
      } catch (err) {
        // If local backend is down, attempt fallback to production backend
        if (API_BASE_URL && API_BASE_URL.includes("localhost") && DEFAULT_PRODUCTION_BACKEND) {
          try {
            const fallbackRes = await fetch(`${DEFAULT_PRODUCTION_BACKEND}/about`);
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              if (isMounted && fallbackData && !fallbackData.message) {
                setAboutData((prev) => ({
                  ...prev,
                  ...fallbackData,
                }));
                return;
              }
            }
          } catch {
            // Silently fall back to default state
          }
        }
        console.warn("Could not fetch about data from backend, using default data.", err);
      }
    };

    fetchAbout();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasResumeFile = Boolean(aboutData.resumeFile);
  const resumeHref = hasResumeFile ? aboutData.resumeFile : (aboutData.resumeLink || "#contact");
  const isExternalResume = !hasResumeFile && aboutData.resumeLink && aboutData.resumeLink.startsWith("http");

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content-wrapper">
          {/* LEFT COLUMN */}
          <div className="about-left">
            <div className="about-heading-wrap">
              <h2 className="about-heading">{aboutData.heading || "About Me"}</h2>
            </div>

            <div className="about-text-content">
              {aboutData.paragraph1 && (
                <p style={{ whiteSpace: "pre-line" }}>{aboutData.paragraph1}</p>
              )}
              {aboutData.paragraph2 && (
                <p style={{ whiteSpace: "pre-line" }}>{aboutData.paragraph2}</p>
              )}
            </div>

            <div className="about-actions-row">
              {/* VIEW RESUME BUTTON */}
              <a
                href={resumeHref}
                download={hasResumeFile ? (aboutData.resumeFileName || "Resume.pdf") : undefined}
                target={hasResumeFile || isExternalResume ? "_blank" : undefined}
                rel={hasResumeFile || isExternalResume ? "noopener noreferrer" : undefined}
                className="about-resume-btn"
                aria-label={aboutData.resumeText || "View Resume"}
              >
                <span className="about-resume-track">
                  <span className="about-resume-text">{aboutData.resumeText || "View Resume"}</span>
                  <span className="about-resume-text about-resume-hover">{aboutData.resumeText || "View Resume"}</span>
                </span>
                <div className="about-resume-arrow">
                  <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                  </svg>
                </div>
              </a>

              {/* SOCIAL SHORTCUTS */}
              <div className="about-socials">
                {aboutData.linkedinUrl && (
                  <a
                    href={aboutData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-roll-link"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                  >
                    <span className="social-roll-track">
                      <span>LN</span>
                      <span>LN</span>
                    </span>
                  </a>
                )}
                {aboutData.githubUrl && (
                  <a
                    href={aboutData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-roll-link"
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <span className="social-roll-track">
                      <span>GH</span>
                      <span>GH</span>
                    </span>
                  </a>
                )}
                {aboutData.instagramUrl && (
                  <a
                    href={aboutData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-roll-link"
                    title="Instagram"
                    aria-label="Instagram"
                  >
                    <span className="social-roll-track">
                      <span>IG</span>
                      <span>IG</span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: IMAGE */}
          <div className="about-right">
            <figure className="about-image-figure">
              <img
                src={aboutData.image || "./images/mee(1).png"}
                alt={aboutData.heading || "About Me Portrait"}
                className="about-portrait-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "./images/mee(1).png"; // Fallback image if the provided image fails to load
                }}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}