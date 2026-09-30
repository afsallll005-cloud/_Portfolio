"use client";

import { useState, useEffect, useRef } from "react";
import "./HowIWork.css";

const workSteps = [
  {
    id: 1,
    number: "01",
    title: "Discover",
    description:
      "I start by understanding the project goals, requirements, target users, and the problem the product needs to solve.",
  },
  {
    id: 2,
    number: "02",
    title: "Plan",
    description:
      "I define the structure, user flow, features, and technical approach to create a clear and scalable development plan.",
  },
  {
    id: 3,
    number: "03",
    title: "Build",
    description:
      "I turn the plan into a functional product using modern technologies like React, Next.js, Node.js, and databases.",
  },
  {
    id: 4,
    number: "04",
    title: "Refine",
    description:
      "I test the application, fix issues, improve responsiveness, and refine the experience across different devices.",
  },
  {
    id: 5,
    number: "05",
    title: "Deploy",
    description:
      "Once everything is ready, I deploy the application and make sure it is stable, accessible, and ready for real users.",
  },
];

export default function HowIWork() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Dynamically update cards per view based on window size
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setCardsPerView(1);
      } else if (width <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, workSteps.length - cardsPerView);

  // Keep index clamped within bounds if window resized
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="how-work-section" id="how-i-work">
      <div
        className="how-work-container"
        style={{ "--current-index": currentIndex }}
      >
        {/* HEADER */}
        <div className="how-work-header">
          <div className="how-work-header-text">
            <p className="how-work-eyebrow">MY PROCESS</p>
            <h2 className="how-work-title">How I Work</h2>
            <p className="how-work-description">
              A structured, user-centric process that turns ideas into high-performing,
              beautifully crafted digital products.
            </p>
          </div>

          {/* CONTROLS */}
          <div className="how-work-controls">
            <button
              type="button"
              className="work-carousel-btn"
              onClick={prevSlide}
              aria-label="Previous step"
              title="Previous step"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
            </button>

            <button
              type="button"
              className="work-carousel-btn"
              onClick={nextSlide}
              aria-label="Next step"
              title="Next step"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* CAROUSEL VIEWPORT */}
        <div
          className="how-work-viewport"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="how-work-track">
            {workSteps.map((step) => (
              <div key={step.id} className="work-step-card">
                <div className="work-step-inner">
                  {/* TOP ROW */}
                  <div className="work-step-top">
                    <span className="work-step-number">{step.number}</span>
                    <div className="work-step-line" />
                  </div>

                  {/* CONTENT */}
                  <div className="work-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>

                  {/* BOTTOM ARROW */}
                  <div className="work-step-arrow">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP INDICATORS */}
        <div className="how-work-indicators">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`work-indicator ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
