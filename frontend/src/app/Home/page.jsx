"use client";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Works from "@/components/Works/Works";
import Services from "@/components/Services/Services";
import About from "@/components/About/About";
import HowIWork from "@/components/HowIWork/HowIWork";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";
import "./Home.css";

export default function Home() {
  return (
    <main className="portfolio">
      <Navbar />
      <Hero />
      <Works />
      <Services />
      <About />
      {/* <Skills /> */}
      <HowIWork />
      <FAQ />
      <Footer />
    </main>
  );
}