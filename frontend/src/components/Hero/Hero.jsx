"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/utils/api";
import "./Hero.css";

export default function Hero() {
  const canvasRef = useRef(null);

  const [heroData, setHeroData] = useState({
    title: "MHDAFSAL",
    subtitle: "I’m Specialized in Creating Website Design.",
    image: "./images/glitchme.jpeg",
  });

  // Fetch dynamic hero data from backend
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.message) {
            setHeroData({
              title: data.title || "MHDAFSAL",
              subtitle: data.subtitle || "I’m Specialized in Creating Website Design.",
              image: data.image || "./images/glitchme.jpeg",
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch dynamic hero from backend, using default.", err);
      }
    };

    fetchHero();
  }, []);

  // Canvas Shader Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Interactive mouse tracking
    let mouse = { x: width * 0.7, y: height * 0.4, targetX: width * 0.7, targetY: height * 0.4 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.007;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.fillStyle = "#010101";
      ctx.fillRect(0, 0, width, height);

      // Deep ambient blue-violet gradient mesh glow
      const cx = width * 0.65 + Math.sin(time * 0.5) * 60;
      const cy = height * 0.5 + Math.cos(time * 0.4) * 50;

      const radialGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width, height) * 0.65);
      radialGrad.addColorStop(0, "rgba(25, 45, 110, 0.45)");
      radialGrad.addColorStop(0.35, "rgba(10, 18, 55, 0.25)");
      radialGrad.addColorStop(0.7, "rgba(5, 7, 22, 0.1)");
      radialGrad.addColorStop(1, "rgba(1, 1, 1, 0)");

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Secondary moving luminous accent
      const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 400);
      mouseGrad.addColorStop(0, "rgba(36, 103, 227, 0.15)");
      mouseGrad.addColorStop(1, "rgba(1, 1, 1, 0)");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing silky curved lines (Shader ribbon effect)
      ctx.lineWidth = 1.2;
      const ribbons = 5;
      for (let r = 0; r < ribbons; r++) {
        ctx.beginPath();
        const baseOpacity = 0.12 - r * 0.018;
        ctx.strokeStyle = `rgba(80, 140, 255, ${Math.max(0.03, baseOpacity)})`;

        for (let x = 0; x < width; x += 15) {
          const freq = 0.0022;
          const offset = r * 0.35;
          const y =
            height * 0.42 +
            Math.sin(x * freq + time + offset) * 110 +
            Math.cos(x * 0.0012 - time * 0.8) * 80 +
            r * 25;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* BACKGROUND SHADER CANVAS */}
      <div className="hero-canvas-container" aria-hidden="true">
        <canvas ref={canvasRef} className="hero-shader-canvas" />
      </div>

      {/* HERO CONTAINER */}
      <div className="hero-container">
        {/* RIGHT TOP PROFILE CARD */}
        <div className="hero-profile-wrapper">
          <div className="hero-profile-card">
            <img
              src={heroData.image}
              alt={heroData.title}
              className="hero-profile-img"
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = "./images/glitchme.jpeg";
              }}
            />
          </div>
        </div>

        {/* BOTTOM HEADINGS */}
        <div className="hero-text-wrapper">
          <div className="hero-subtitle">
            <h2>{heroData.subtitle}</h2>
          </div>

          <div className="hero-main-title">
            <h1>{heroData.title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}