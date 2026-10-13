"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/api";
import "./Hero.css";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: "MHD AFSAL",
    headline: "THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM.",
    desktopImage: "/images/Laptop-Hero.png",
    mobileImage: "/images/Phone-Hero.png",
    image: "/images/glitchme.jpeg",
    phrase: "Best website designer in Malappuram",
  });

  // Fetch dynamic hero data from backend
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/hero`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.message) {
            const parseImg = (val) => {
              if (typeof val === "string") {
                let cleaned = val.trim();
                if (cleaned.startsWith("./")) {
                  cleaned = cleaned.replace(/^\.\//, "/");
                }
                if (cleaned) return cleaned;
              }
              return "/images/glitchme.jpeg";
            };

            const desktopImg = parseImg(data.desktopImage || data.image);
            const mobileImg = parseImg(data.mobileImage || data.desktopImage || data.image);

            setHeroData({
              title: data.title || "MHD AFSAL",
              headline:
                data.subtitle && !data.subtitle.includes("I’m Specialized")
                  ? data.subtitle
                  : "THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM.",
              desktopImage: desktopImg,
              mobileImage: mobileImg,
              image: desktopImg,
              phrase: data.searchPhrase || "Best website designer in Malappuram",
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch hero from backend, using defaults.", err);
      }
    };

    fetchHero();
  }, []);

  // Exact GSAP + ScrollTrigger animation from bilalgrowth.com
  useEffect(() => {
    let isCancelled = false;
    let tl = null;
    let unlockTimer = null;
    let typingTimer = null;
    let resizeTimer = null;
    let cleanupListeners = () => {};

    const loadScript = (src, globalKey) => {
      return new Promise((resolve) => {
        if (typeof window !== "undefined" && window[globalKey]) {
          return resolve();
        }
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (existing.getAttribute("data-loaded") === "true" || window[globalKey]) {
            return resolve();
          }
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.setAttribute("data-loaded", "true");
          resolve();
        };
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });
    };

    const boot = () => {
      if (isCancelled) return;
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) return;

      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      gsap.registerPlugin(ScrollTrigger);

      const root = document.getElementById("abHero");
      const search = document.getElementById("abSearch");
      const typing = document.getElementById("abTyping");
      const adil = document.getElementById("abAdil");
      const bilal = document.getElementById("abBilal");
      const headline = document.getElementById("abHeadline");
      const cover = document.getElementById("abCenterCover");
      const siteHeader =
        document.querySelector("header.navbar") ||
        document.querySelector(".navbar");

      if (!root || !search || !typing || !adil || !bilal || !headline || !cover) {
        return;
      }

      let scrollUnlocked = false;
      document.documentElement.classList.add("ab-scroll-locked");
      document.body.classList.add("ab-scroll-locked");

      function unlockScroll() {
        if (scrollUnlocked) return;
        scrollUnlocked = true;
        document.documentElement.classList.remove("ab-scroll-locked");
        document.body.classList.remove("ab-scroll-locked");
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh(true);
        }
      }

      unlockTimer = setTimeout(unlockScroll, 5200);

      // Typing animation
      const phrase = heroData.phrase || "Best website designer in Malappuram";
      let i = 0;
      function typeNext() {
        if (isCancelled) return;
        if (i <= phrase.length) {
          if (typing) typing.textContent = phrase.slice(0, i);
          i++;
          typingTimer = setTimeout(typeNext, 55);
        }
      }
      typeNext();

      // Click or touch to skip search intro immediately
      const handleSearchClick = () => {
        gsap.killTweensOf(search);
        gsap.to(search, {
          autoAlpha: 0,
          duration: 0.35,
          onComplete: unlockScroll,
        });
      };
      search.addEventListener("click", handleSearchClick);
      search.addEventListener("touchstart", handleSearchClick, { passive: true });

      gsap.to(search, {
        autoAlpha: 0,
        duration: 0.72,
        delay: 3.55,
        ease: "power3.inOut",
        onComplete: unlockScroll,
      });

      const img = cover.querySelector("img");

      function getCoverScale() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw <= 767;
        const baseW = isMobile ? Math.min(vw * 0.84, 340) : Math.min(vw * 0.43, 760);
        const baseH = isMobile ? baseW * 1.25 : (baseW * 9) / 16;
        return Math.max(vw / baseW, vh / baseH) * (isMobile ? 1.08 : 1.04);
      }

      let headlineShown = false;

      function buildTimeline() {
        if (tl) {
          tl.scrollTrigger && tl.scrollTrigger.kill();
          tl.kill();
          tl = null;
        }
        headlineShown = false;
        const isMobile = window.innerWidth <= 767;
        const fullScale = getCoverScale();
        const splitDistance = Math.min(window.innerWidth * (isMobile ? 0.35 : 0.14), 220);
        const startScale = isMobile ? 0.72 : 0.18;
        const revealScale = isMobile ? 1.0 : 0.3;

        gsap.set(adil, { x: 0, opacity: 1 });
        gsap.set(bilal, { x: 0, opacity: 1 });
        gsap.set(headline, { opacity: 0, y: 24 });
        if (siteHeader) {
          gsap.set(siteHeader, { opacity: 0, pointerEvents: "none" });
        }
        gsap.set(cover, {
          xPercent: -50,
          yPercent: -50,
          scale: startScale,
          opacity: 0,
          borderRadius: isMobile ? 18 : 12,
          borderWidth: 1,
        });

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () =>
              "+=" +
              window.innerHeight * (window.innerWidth <= 767 ? 1.0 : 1.1),
            pin: root,
            pinSpacing: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 30,
            onUpdate: function (self) {
              if (self.progress >= 0.38 && !headlineShown) {
                headlineShown = true;
                gsap.to(headline, {
                  opacity: 1,
                  y: 0,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: true,
                });
              } else if (self.progress < 0.38 && headlineShown) {
                headlineShown = false;
                gsap.to(headline, {
                  opacity: 0,
                  y: 24,
                  duration: 0.25,
                  ease: "power2.in",
                  overwrite: true,
                });
              }
            },
          },
        });

        tl.to(adil, { x: -splitDistance, duration: 0.18 }, 0);
        tl.to(bilal, { x: splitDistance, duration: 0.18 }, 0);
        tl.to(cover, { opacity: 1, scale: revealScale, duration: 0.05 }, 0.02);
        tl.to(
          cover,
          {
            scale: fullScale,
            borderRadius: 0,
            borderWidth: 0,
            duration: 0.3,
          },
          0.08
        );
        tl.to(adil, { opacity: 0, duration: 0.1 }, 0.22);
        tl.to(bilal, { opacity: 0, duration: 0.1 }, 0.22);
        if (siteHeader) {
          tl.to(
            siteHeader,
            { opacity: 1, pointerEvents: "auto", duration: 0.14 },
            isMobile ? 0.82 : 0.58
          );
        }
        tl.to(cover, { scale: fullScale, duration: 0.54 }, 0.46);
      }

      function init() {
        buildTimeline();
        requestAnimationFrame(function () {
          ScrollTrigger.refresh(true);
          if (window.scrollY <= 0 && tl) {
            tl.progress(0, true);
          }
        });
        setTimeout(function () {
          ScrollTrigger.refresh(true);
          if (window.scrollY <= 0 && tl) {
            tl.progress(0, true);
          }
        }, 650);
      }

      if (img && img.complete) {
        init();
      } else if (img) {
        img.addEventListener("load", init, { once: true });
        setTimeout(function () {
          if (!tl) init();
        }, 1200);
      } else {
        init();
      }

      let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
      const handleResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          buildTimeline();
          ScrollTrigger.refresh(true);
        }, 220);
      };
      window.addEventListener("resize", handleResize, { passive: true });

      cleanupListeners = () => {
        search.removeEventListener("click", handleSearchClick);
        search.removeEventListener("touchstart", handleSearchClick);
        window.removeEventListener("resize", handleResize);
      };
    };

    // Load GSAP + ScrollTrigger from CDN
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "gsap"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "ScrollTrigger"),
    ]).then(() => {
      boot();
    });

    return () => {
      isCancelled = true;
      clearTimeout(unlockTimer);
      clearTimeout(typingTimer);
      clearTimeout(resizeTimer);
      cleanupListeners();
      document.documentElement.classList.remove("ab-scroll-locked");
      document.body.classList.remove("ab-scroll-locked");
      if (tl) {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, [heroData.phrase]);

  // Parse name into two words
  const rawTitle = (heroData.title || "MHD AFSAL").trim();
  let firstWord = "MHD";
  let secondWord = "AFSAL";
  if (rawTitle.includes(" ")) {
    const parts = rawTitle.split(/\s+/);
    firstWord = parts[0];
    secondWord = parts.slice(1).join(" ");
  } else if (rawTitle.toUpperCase().startsWith("MHD") && rawTitle.length > 3) {
    firstWord = "MHD";
    secondWord = rawTitle.slice(3).trim();
  }

  // Parse headline
  const headlineText = heroData.headline || "THE BEST WEBSITE DESIGNER &\nDEVELOPER IN MALAPPURAM.";
  const lines = headlineText.split("\n");
  const lastLine = lines[lines.length - 1];
  const matchAccent = lastLine.match(/(.*?\bIN\s+)?([A-Za-z0-9_-]+)(\.?)?$/i);

  return (
    <section
        id="abHero"
        aria-label={`${firstWord} ${secondWord}, Best Website Designer in Malappuram — hero section`}
      >
        <div className="viewport">
          {/* SEARCH INTRO */}
          <div className="search" id="abSearch" aria-hidden="true">
            <div className="search-bar">
              <span className="search-icon">⌕</span>
              <div className="search-text" id="abTyping"></div>
              <span className="search-caret"></span>
            </div>
          </div>

          {/* SPLITTING NAME */}
          <div className="name-layer" aria-hidden="true">
            <div className="name">
              <span className="word" id="abAdil">
                {firstWord}
              </span>
              <span className="word" id="abBilal">
                {secondWord}
              </span>
            </div>
          </div>

          {/* REVEALING HEADLINE */}
          <div className="headline-layer" id="abHeadline">
            <h1>
              {lines.slice(0, -1).map((l, idx) => (
                <span key={idx}>
                  {l}
                  <br />
                </span>
              ))}
              {matchAccent ? (
                <>
                  {matchAccent[1] || ""}
                  <span className="accent">{matchAccent[2]}</span>
                  {matchAccent[3] || ""}
                </>
              ) : (
                lastLine
              )}
            </h1>
          </div>

          {/* 2. CENTER COVER IMAGE (ANIMATED BY GSAP TIMELINE ON SCROLL) */}
          <div id="abCenterCover">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={heroData.mobileImage || heroData.image || "/images/glitchme.jpeg"}
              />
              <source
                media="(min-width: 768px)"
                srcSet={heroData.desktopImage || heroData.image || "/images/glitchme.jpeg"}
              />
              <img
                src={heroData.desktopImage || heroData.image || "/images/glitchme.jpeg"}
                alt={`${firstWord} ${secondWord} — Best Website Designer in Malappuram`}
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.tried) {
                    target.dataset.tried = "1";
                    target.src = "/images/glitchme.jpeg";
                  } else if (target.dataset.tried === "1") {
                    target.dataset.tried = "2";
                    target.src =
                      "https://bilalgrowth.com/wp-content/uploads/2026/09/best-digital-marketing-strategist-calicut-2.webp";
                  }
                }}
              />
            </picture>
          </div>
        </div>
      </section>
  );
}