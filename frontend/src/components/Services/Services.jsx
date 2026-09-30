"use client";

import { useState } from "react";
import "./Services.css";

const servicesList = [
  {
    number: "01",
    title: "Website Design",
    description:
      "Crafting bespoke, high-conversion web experiences with immaculate typography, intuitive interactions, and responsive aesthetics tailored to elevate brand credibility.",
    deliverables: ["Responsive Web Design", "Interactive Prototypes", "Wireframing & Sitemaps", "Design Systems"],
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Designing human-centered user journeys through in-depth user research, information architecture, intuitive micro-interactions, and pixel-perfect interface execution.",
    deliverables: ["User Journey Mapping", "Usability Audits", "Figma Design Libraries", "Component Architecture"],
  },
  {
    number: "03",
    title: "Logo & Branding",
    description:
      "Developing distinctive visual identities that stand out in crowded markets. From iconic marks and color palettes to typography rules and digital brand assets.",
    deliverables: ["Visual Identity Systems", "Brand Styleguides", "Logo Design & Vectors", "Social & Marketing Kits"],
  },
  {
    number: "04",
    title: "Framer Development",
    description:
      "Translating creative visions into blazingly fast, accessible, and SEO-optimized web realities using Framer, Next.js, React, and bespoke animations.",
    deliverables: ["Fullstack Next.js / Framer", "Scroll-Driven Animations", "CMS Integrations", "Speed & SEO Optimization"],
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const toggleService = (idx) => {
    setActiveService(activeService === idx ? null : idx);
  };

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        {/* SECTION TITLE */}
        <div className="services-title-wrapper">
          <h2 className="services-title">My Services</h2>
        </div>

        {/* ACCORDION LIST */}
        <div className="services-list">
          {servicesList.map((service, index) => {
            const isOpen = activeService === index;

            return (
              <div
                key={service.number}
                className={`service-item ${isOpen ? "active" : ""}`}
                onClick={() => toggleService(index)}
              >
                <div className="service-header">
                  <span className="service-number">{service.number}</span>

                  <div className="service-info-row">
                    <h3 className="service-name">{service.title}</h3>
                    <div className="service-toggle-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        className={`toggle-svg ${isOpen ? "rotated" : ""}`}
                      >
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE CONTENT */}
                <div className={`service-expandable ${isOpen ? "expanded" : ""}`}>
                  <div className="service-expandable-inner">
                    <p className="service-desc">{service.description}</p>
                    <div className="service-deliverables">
                      {service.deliverables.map((item) => (
                        <span key={item} className="deliverable-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}