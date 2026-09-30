export default function Contact() {
  return (
    <section
      className="contact-section"
      id="contact"
    >

      <div className="contact-title">

        <span className="section-label">
          HAVE A PROJECT?
        </span>

        <h2>
          LET&apos;S WORK
          <br />
          TOGETHER.
        </h2>

      </div>


      <div className="contact-details">

        <a href="mailto:your@email.com">
          your@email.com
        </a>


        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          LINKEDIN ↗
        </a>


        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GITHUB ↗
        </a>

      </div>


      <a
        href="mailto:your@email.com"
        className="contact-button"
      >

        <span>
          GET IN TOUCH
        </span>

        <span>
          ↗
        </span>

      </a>

    </section>
  );
}