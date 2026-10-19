
"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL, DEFAULT_PRODUCTION_BACKEND } from "@/utils/api";
import "./About.css";

const initialAboutData = {
  heading: "Mohammed Afsal",
  paragraph1:
    "I'm a Full Stack Developer, recently completed the Full Stack Web Development course at the G-TEC Center of Excellence. I build modern, responsive and user-friendly web applications using the MERN stack and love turning ideas into real products.",
  paragraph2:
    "Through projects and a 2-month internship at globaOne, I've gained hands-on experience, improved my problem-solving skills and grown in real-world web development.",
  image: "/images/portfolioImg.png",
  resumeText: "View Resume",
  resumeLink: "#contact",
  resumeFile: "",
  resumeFileName: "",
  linkedinUrl:
    "https://www.linkedin.com/in/mohammed-afsal-8a52b23aa",
  githubUrl: "https://github.com/afsallll005-cloud",
  instagramUrl:
    "https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==",
};

export default function About() {
  const [aboutData, setAboutData] = useState(initialAboutData);

  useEffect(() => {
    let isMounted = true;

    const fetchAbout = async () => {
      const fetchData = async (baseUrl) => {
        const response = await fetch(`${baseUrl}/about`);

        if (!response.ok) {
          throw new Error("Unable to fetch About data");
        }

        return response.json();
      };

      try {
        let data;

        try {
          data = await fetchData(API_BASE_URL);
        } catch (error) {
          if (
            !API_BASE_URL?.includes("localhost") ||
            !DEFAULT_PRODUCTION_BACKEND
          ) {
            throw error;
          }

          data = await fetchData(DEFAULT_PRODUCTION_BACKEND);
        }

        if (isMounted && data && !data.message) {
          const isBlackBgPlaceholder =
            typeof data.image === "string" &&
            (data.image.includes("framerusercontent.com") ||
             data.image.includes("Lwf11"));

          setAboutData((prev) => ({
            ...prev,
            ...data,
            image: isBlackBgPlaceholder
              ? "/images/mee(1).png"
              : data.image || "/images/mee(1).png",
          }));
        }
      } catch (error) {
        console.warn(
          "Could not fetch About data. Using default content.",
          error
        );
      }
    };

    fetchAbout();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasResumeFile = Boolean(aboutData.resumeFile);
  const resumeHref = hasResumeFile
    ? aboutData.resumeFile
    : aboutData.resumeLink || "#contact";

  const isExternalResume =
    !hasResumeFile &&
    aboutData.resumeLink?.startsWith("http");

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content-wrapper">
          {/* LEFT CONTENT */}
          <div className="about-left">
            <div className="about-intro">
              <div className="about-eyebrow">
                <span className="about-eyebrow-line" />
                <span>ABOUT ME</span>
              </div>

              <h2 className="about-heading">
                {aboutData.heading || "Mohammed Afsal"}
              </h2>

              <div className="about-text-content">
                {aboutData.paragraph1 && (
                  <p>{aboutData.paragraph1}</p>
                )}

                {aboutData.paragraph2 && (
                  <p>{aboutData.paragraph2}</p>
                )}
              </div>
            </div>

            {/* STATS */}
            <div className="about-stats">
              <div className="about-stat">
                <h3>23</h3>
                <p>Years Old</p>
              </div>

              <div className="about-stat">
                <h3>MERN</h3>
                <p>Stack Developer</p>
              </div>

              <div className="about-stat">
                <h3>2+</h3>
                <p>Months Internship</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="about-actions-row">
              <a
                href={resumeHref}
                download={
                  hasResumeFile
                    ? aboutData.resumeFileName || "Resume.pdf"
                    : undefined
                }
                target={
                  hasResumeFile || isExternalResume
                    ? "_blank"
                    : undefined
                }
                rel={
                  hasResumeFile || isExternalResume
                    ? "noopener noreferrer"
                    : undefined
                }
                className="about-resume-btn"
                aria-label={aboutData.resumeText || "View Resume"}
              >
                <span>
                  {aboutData.resumeText || "View Resume"}
                </span>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <div className="about-socials">
                {aboutData.linkedinUrl && (
                  <a
                    href={aboutData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-link"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <span className="linkedin-mark">in</span>
                  </a>
                )}

                {aboutData.githubUrl && (
                  <a
                    href={aboutData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-link"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="23"
                      height="23"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.73 2.01 3.17 1.42.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.43.11-2.97 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.97.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.51.4.35.75 1.03.75 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
                    </svg>
                  </a>
                )}

                {aboutData.instagramUrl && (
                  <a
                    href={aboutData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-social-link"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="23"
                      height="23"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                      />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.8"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PORTRAIT */}
          <div className="about-right">
            <div className="about-portrait-backdrop" />

            <svg
              className="about-orbit"
              viewBox="0 0 560 520"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M75 310 C -15 400 65 435 175 370 S 350 280 465 185 S 400 125 375 145"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            <span className="about-sparkle" aria-hidden="true">
              ✦
            </span>

            <figure className="about-image-figure">
              <img
                src={
                  aboutData.image && !aboutData.image.includes("framerusercontent.com")
                    ? aboutData.image
                    : "/images/mee(1).png"
                }
                alt="Mohammed Afsal - Full Stack Developer"
                className="about-portrait-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/mee(1).png";
                }}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
