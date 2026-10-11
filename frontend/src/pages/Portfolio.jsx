import { useEffect, useState } from "react";
import {
  getPublicProjects,
  getPublicSkills,
  getPublicExperience,
  getPublicEducation,
} from "../services/api";
import ContactForm from "../components/ContactForm";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const results = await Promise.all([
          getPublicProjects(),
          getPublicSkills(),
          getPublicExperience(),
          getPublicEducation(),
        ]);

        setProjects(results[0]);
        setSkills(results[1]);
        setExperience(results[2]);
        setEducation(results[3]);
      } catch (err) {
        setError("Some portfolio content couldn't be loaded. Please refresh the page.");
        console.error("Portfolio loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Present";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="portfolio-page">
      <header className="portfolio-navbar">
        <a className="portfolio-logo" href="#home">
          mitali<span>.</span>
        </a>

        <nav className="portfolio-nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a className="nav-contact-link" href="#contact">Let's Talk ♡</a>
        </nav>
      </header>

      <main>
        <section className="portfolio-hero" id="home">
          <div className="hero-content">
            <p className="hero-eyebrow">✦ HELLO THERE, WELCOME TO MY SPACE</p>

            <h1>
              Turning ideas into
              <span> digital experiences.</span>
            </h1>

            <p className="hero-description">
              Hi, I'm Mitali — a developer who loves building useful
              applications, exploring new technologies, and bringing creative
              ideas to life through code.
            </p>

            <div className="hero-actions">
                <a className="portfolio-button" href="#projects">
                    Explore my work ↗
                </a>
                <a className="portfolio-text-link" href="#contact">
                    Get in touch
                </a>
                <a
                className="resume-button"
                href="/Mitali_Gawai_Resume_(1).pdf"
                target="_blank"
                rel="noreferrer">
                    View Resume ↗
                </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-dot" />
              Open to learning, collaboration & opportunities
            </div>
          </div>

          <div className="hero-art" aria-label="Decorative portfolio illustration">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-center-card">
              <span className="hero-sparkle">✳</span>
              <div className="hero-avatar">M.</div>
              <p>Curious mind.</p>
              <p className="hero-card-accent">Creative builder.</p>
              <span className="hero-heart">♡</span>
            </div>
            <span className="floating-shape shape-star">✦</span>
            <span className="floating-shape shape-heart">♡</span>
            <span className="floating-shape shape-dot">✳</span>
          </div>

          <a className="hero-scroll" href="#about">SCROLL TO EXPLORE ↓</a>
        </section>

        <section className="portfolio-section about-section" id="about">
          <div className="section-heading">
            <p className="section-eyebrow">A LITTLE INTRODUCTION</p>
            <h2>More than just <span>code.</span></h2>
          </div>

          <div className="about-card">
            <div className="about-symbol">✿</div>
            <div>
              <p>
                I'm a final-year Computer Engineering student and aspiring software
                developer currently gaining practical experience through a Python
                Developer internship. I'm interested in Python, web development,and problem-solving, 
                and I enjoy learning by building projects
                and turning ideas into practical applications.
            </p>
            <p>
                This space is where I share my projects, technical skills,
                experience, and the journey I'm building one step at a time.
                I'm continuously learning, strengthening my fundamentals,
                and exploring new technologies along the way.
            </p>
            </div>
          </div>
        </section>

        <section className="portfolio-section projects-section" id="projects">
          <div className="section-heading">
            <p className="section-eyebrow">A FEW THINGS I'VE BUILT</p>
            <h2>Featured <span>projects.</span></h2>
            <p className="section-description">
              Ideas, experiments, and applications brought to life.
            </p>
          </div>

          {loading ? (
            <p className="portfolio-status">Loading projects... ♡</p>
          ) : projects.length === 0 ? (
            <p className="portfolio-empty">
              My projects will appear here soon. Check back for updates!
            </p>
          ) : (
            <div className="portfolio-project-grid">
              {projects.map((project) => (
                <article className="portfolio-project-card" key={project.id}>
                  {project.image ? (
                    <img
                      className="project-card-image"
                      src={
                        project.image.startsWith("http")
                          ? project.image
                          : `http://127.0.0.1:8000${project.image}`
                      }
                      alt={project.title}
                    />
                  ) : (
                    <div className="project-card-placeholder">✳</div>
                  )}

                  <div className="project-card-content">
                    <p className="project-card-kicker">SELECTED WORK</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {project.technologies && (
                      <div className="project-tech-list">
                        {project.technologies
                          .split(",")
                          .map((technology) => technology.trim())
                          .filter(Boolean)
                          .map((technology) => (
                            <span key={technology}>{technology}</span>
                          ))}
                      </div>
                    )}

                    <div className="project-card-links">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                          GitHub ↗
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer">
                          Live demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-section skills-section" id="skills">
          <div className="section-heading">
            <p className="section-eyebrow">TOOLS IN MY TOOLKIT</p>
            <h2>Skills I'm <span>growing.</span></h2>
          </div>

          {loading ? (
            <p className="portfolio-status">Loading skills... ♡</p>
          ) : skills.length === 0 ? (
            <p className="portfolio-empty">
              Skills will appear here once they're published from the dashboard.
            </p>
          ) : (
            <div className="portfolio-skill-grid">
              {skills.map((skill) => (
                <article className="portfolio-skill-card" key={skill.id}>
                  <div className="skill-card-top">
                    <h3>{skill.name}</h3>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <p>{skill.category}</p>
                  <div className="skill-progress-track">
                    <div
                      className="skill-progress-fill"
                      style={{
                        width: `${Math.min(100, Math.max(0, skill.proficiency))}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-section experience-section" id="experience">
          <div className="section-heading">
            <p className="section-eyebrow">WHAT I'VE BEEN UP TO</p>
            <h2>My <span>experience.</span></h2>
          </div>

          {loading ? (
            <p className="portfolio-status">Loading experience... ♡</p>
          ) : experience.length === 0 ? (
            <p className="portfolio-empty">
              Experience details will appear here once published.
            </p>
          ) : (
            <div className="portfolio-timeline">
              {experience.map((item) => (
                <article className="portfolio-timeline-card" key={item.id}>
                  <span className="timeline-dot" />
                  <div className="timeline-card-heading">
                    <div>
                      <h3>{item.role}</h3>
                      <p className="timeline-organization">{item.company}</p>
                    </div>
                    <span className="timeline-date">
                      {formatDate(item.start_date)} —{" "}
                      {item.is_current ? "Present" : formatDate(item.end_date)}
                    </span>
                  </div>
                  <p className="timeline-description">{item.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-section education-section" id="education">
          <div className="section-heading">
            <p className="section-eyebrow">THE LEARNING JOURNEY</p>
            <h2>My <span>education.</span></h2>
          </div>

          {loading ? (
            <p className="portfolio-status">Loading education... ♡</p>
          ) : education.length === 0 ? (
            <p className="portfolio-empty">
              Education details will appear here once published.
            </p>
          ) : (
            <div className="portfolio-education-grid">
              {education.map((item) => (
                <article className="portfolio-education-card" key={item.id}>
                  <span className="education-icon">✧</span>
                  <h3>{item.degree}</h3>
                  <p className="education-field">{item.field_of_study}</p>
                  <p className="education-institution">{item.institution}</p>
                  <p className="education-date">
                    {formatDate(item.start_date)} — {formatDate(item.end_date)}
                  </p>
                  {item.description && <p>{item.description}</p>}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-section contact-section" id="contact">
          <div className="contact-intro">
            <p className="section-eyebrow">HAVE SOMETHING IN MIND?</p>
            <h2>Let's make something <span>great.</span></h2>
            <p>
              Have an opportunity, an idea, or just want to connect? I'd love
              to hear from you.
            </p>
            <span className="contact-decoration">made with curiosity & ♡</span>
          </div>

          <div className="contact-form-card">
            <ContactForm />
          </div>
        </section>

        {error && (
          <p className="portfolio-global-error" role="alert">
            {error}
          </p>
        )}
      </main>

      <footer className="portfolio-footer">
        <a className="portfolio-logo" href="#home">mitali<span>.</span></a>
        <p>Designed with intention, built with curiosity. ♡</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default Portfolio;