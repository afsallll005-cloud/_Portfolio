"use client";

import { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    id: 1,
    question: "What Service do you offer?",
    answer:
      "I specialize in end-to-end digital solutions including custom Website Design, interactive UI/UX design, full design systems, Framer / Next.js development, and brand identity design tailored to elevate your business presence.",
  },
  {
    id: 2,
    question: "Do you use code in your projects?",
    answer:
      "Yes, absolutely. Depending on your needs, I work with modern full-stack web technologies including React, Next.js, and Vanilla CSS, as well as no-code platforms like Framer for rapid deployment and easy client self-management.",
  },
  {
    id: 3,
    question: "Can you help redesign my existing website?",
    answer:
      "Definitely. We begin with a comprehensive UX audit of your current site, identifying friction points and conversion opportunities, and then build a refreshed, contemporary design that aligns with modern aesthetic standards.",
  },
  {
    id: 4,
    question: "How long does a typical project take?",
    answer:
      "A standard landing page or portfolio generally takes 2 to 3 weeks. Comprehensive web applications and full multi-page redesigns typically take 4 to 6 weeks, structured across clear milestone approvals.",
  },
  {
    id: 5,
    question: "Will I be able to edit the website after it’s done?",
    answer:
      "Yes! You will receive full access along with clean, intuitive CMS controls and a personalized video walkthrough demonstrating how to easily add or update projects, blog posts, and copy with zero technical headache.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        {/* LEFT COLUMN: TITLE */}
        <div className="faq-left">
          <h2 className="faq-title">Common Questions</h2>
        </div>

        {/* RIGHT COLUMN: ACCORDION LIST */}
        <div className="faq-right">
          <div className="faq-accordion-list">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.id}
                  className={`faq-item ${isOpen ? "active" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-header">
                    <h3 className="faq-question">{item.question}</h3>
                    <div className="faq-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        className={`faq-plus-icon ${isOpen ? "rotated" : ""}`}
                      >
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                      </svg>
                    </div>
                  </div>

                  <div className={`faq-body ${isOpen ? "open" : ""}`}>
                    <div className="faq-body-inner">
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
