"use client";

import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-container">
        {/* LOGO */}
        <a href="#home" className="navbar-logo" aria-label="Home">
          <span className="navbar-logo-text">Mhdafsal.</span>
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <a href="#home" className="nav-item">
            <span className="nav-item-track">
              <span className="nav-item-text">Home</span>
              <span className="nav-item-text nav-item-hover">Home</span>
            </span>
          </a>
          <a href="#about" className="nav-item">
            <span className="nav-item-track">
              <span className="nav-item-text">About</span>
              <span className="nav-item-text nav-item-hover">About</span>
            </span>
          </a>
          <a href="#works" className="nav-item">
            <span className="nav-item-track">
              <span className="nav-item-text">Project</span>
              <span className="nav-item-text nav-item-hover">Project</span>
            </span>
          </a>
          <a href="#services" className="nav-item">
            <span className="nav-item-track">
              <span className="nav-item-text">Services</span>
              <span className="nav-item-text nav-item-hover">Services</span>
            </span>
          </a>
          {/* <a href="#skills" className="nav-item">
            <span className="nav-item-track">
              <span className="nav-item-text">Skills</span>
              <span className="nav-item-text nav-item-hover">Skills</span>
            </span>
          </a> */}
        </nav>

        {/* CTA BUTTON */}
        <div className="navbar-right">
          <a href="#contact" className="navbar-cta">
            <span className="navbar-cta-track">
              <span className="navbar-cta-text">START A PROJECT</span>
              <span className="navbar-cta-text navbar-cta-hover">START A PROJECT</span>
            </span>
            <div className="navbar-cta-arrow">
              <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </div>
          </a>

          {/* HAMBURGER TOGGLE */}
          <button
            className={`navbar-hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <nav className="mobile-nav-links">
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#works" onClick={() => setMobileMenuOpen(false)}>Project</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          {/* <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a> */}
          <a href="#contact" className="mobile-cta" onClick={() => setMobileMenuOpen(false)}>
            START A PROJECT →
          </a>
        </nav>
      </div>
    </header>
  );
}