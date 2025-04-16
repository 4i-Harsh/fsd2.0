import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Clock,
  Globe,
  MessageSquare,
  BarChart3,
  FileText,
  Users,
  CheckCircle,
  Building2,
  ChevronRight,
  Star,
  Menu,
  X,
} from "lucide-react"
import "../styles/LandingPage.css"

const LandingPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("students")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)

  // Animation helper for scroll reveal
  const revealOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed")
        observer.unobserve(entry.target)
      }
    })
  }

  // Set up intersection observer when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(revealOnScroll, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    })

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Cursor glow effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY })
      setCursorVisible(true)
    }

    const handleMouseLeave = () => {
      setCursorVisible(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="landing-container">
      {/* Cursor Glow Effect */}
      <div 
        className={`cursor-glow ${cursorVisible ? 'active' : ''}`} 
        style={{ 
          left: `${cursorPosition.x}px`, 
          top: `${cursorPosition.y}px` 
        }}
      />

      {/* Background Animation Elements */}
      <div className="animated-background">
        <div className="grid-lines"></div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="animated-shape shape-1"></div>
        <div className="animated-shape shape-2"></div>
        <div className="animated-shape shape-3"></div>
      </div>

      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo-container">
            <Building2 className="logo-icon" />
            <span className="logo-text">InternHub</span>
          </div>

          <nav className={`nav-links ${mobileMenuOpen ? "flex" : "hidden"}`}>
            <a
              href="#features"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefits
            </a>
            <a
              href="#contact"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <button
              className="cta-button"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
      </nav>

          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "" : "hidden"}`}>
        <a
          href="#features"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Features
        </a>
        <a
          href="#benefits"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Benefits
        </a>
        <a
          href="#contact"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </a>
        <button
          className="cta-button"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-glow"></div>
        
        {/* Add circuit pattern and animated elements */}
        <div className="circuit-pattern"></div>
        <div className="circuit-lines">
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
        </div>
        <div className="data-node"></div>
        <div className="data-node"></div>
        <div className="data-node"></div>
        <div className="data-node"></div>
        <div className="data-node"></div>

        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content reveal fade-right">
              
              <h1 className="hero-title">
                Welcome to{" "}
                <span className="hero-title-gradient" data-text="InternHub">
                  InternHub
                </span>
              </h1>
              <p className="hero-description">
                Your gateway to meaningful internships and professional growth, powered by innovation.
              </p>

              <div className="hero-buttons">
                <button
                  onClick={() => navigate("/login")}
                  className="hero-cta-button"
                >
                  Get Started Now
                  <ChevronRight className="cta-icon" />
                </button>
                <a
                  href="#features"
                  className="hero-secondary-button"
                >
                  Learn More
                </a>
              </div>

              <div className="hero-trusted-by">
                <p className="hero-trusted-by-text">Trusted by leading institutions worldwide</p>
                <div className="hero-avatars">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="hero-avatar"
                    >
                      <span className="hero-avatar-text">U{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hero-image-container reveal fade-left">
              <div className="hero-image-overlay"></div>
              <div className="hero-image-wrapper">
                <img
                  src="https://img.freepik.com/premium-photo/orange-silhouette-highlighted-job-seeker-crowd-people-black-shadows-looking-job_484832-1137.jpg"
                  alt="Platform Dashboard"
                  className="hero-image"
                />
                <div className="hero-image-overlay-hover"></div>
              </div>

              <div className="hero-image-glow-1"></div>
              <div className="hero-image-glow-2"></div>
              
              {/* Floating elements */}
              <div className="floating-element floating-element-1">SDG Impact</div>
              <div className="floating-element floating-element-2">AI Matching</div>
              <div className="floating-element floating-element-3">Progress Tracking</div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Key Features Section */}
      <section id="features" className="features-section">
        <div className="features-background"></div>

        <div className="features-container">
          <div className="features-header reveal fade-up">
            <div className="features-badge">
              <span className="features-badge-text">Powerful Features</span>
            </div>
            <h2 className="features-title">
              Comprehensive <span className="features-title-gradient">Solutions</span>
            </h2>
            <p className="features-description">
              Our platform streamlines internship management and enhances collaboration among all stakeholders.
            </p>
          </div>

        <div className="features-grid">
            {[
              {
                icon: Search,
                title: "For Students",
                description: "Find the perfect internship opportunity to kickstart your career",
              },
              {
                icon: Users,
                title: "For Teachers",
                description: "Guide and mentor students in their professional journey",
              },
              {
                icon: BarChart3,
                title: "For Management",
                description: "Manage and oversee the internship program effectively",
              },
              {
                icon: Clock,
                title: "Progress Tracking",
                description: "Monitor milestones and deadlines in real time with intuitive dashboards",
              },
              {
                icon: Globe,
                title: "SDG Mapping",
                description: "Align internships with sustainability goals and track contributions",
              },
              {
                icon: FileText,
                title: "Auto-Generated Reports",
                description: "Showcase growth and achievements with professional reports",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="feature-card reveal fade-up"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="feature-card-glow"></div>

                  <div className="feature-icon">
                    <Icon />
                  </div>

                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              )
            })}
          </div>

          <div className="features-cta reveal fade-up">
            <button className="features-cta-button">
              Learn More About Our Features
              <ChevronRight className="features-cta-icon" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-background"></div>

        <div className="testimonials-container">
          <div className="testimonials-header reveal fade-up">
            <div className="testimonials-badge">
              <span className="testimonials-badge-text">Success Stories</span>
            </div>
            <h2 className="testimonials-title">
              What Our <span className="testimonials-title-gradient">Users Say</span>
            </h2>
            <p className="testimonials-description">
              Hear from students, teachers, and administrators who have transformed their internship experience.
            </p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                quote:
                  "InternHub completely transformed how I find and manage internships. The platform is intuitive and helped me land my dream position.",
                name: "Sarah Johnson",
                role: "Computer Science Student",
                rating: 5,
              },
              {
                quote:
                  "As a professor, I can now easily track my students' progress and provide timely feedback. The SDG mapping feature is revolutionary.",
                name: "Dr. Michael Chen",
                role: "Associate Professor",
                rating: 5,
              },
              {
                quote:
                  "The analytics provided by InternHub have been invaluable for our institution's reporting and improvement initiatives.",
                name: "Amanda Rodriguez",
                role: "University Administrator",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card reveal fade-up"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="testimonial-star" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i + testimonial.rating} className="testimonial-star-empty" />
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div>
                  <p className="testimonial-author">{testimonial.name}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Specific Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="benefits-background"></div>

        <div className="benefits-container">
          <div className="benefits-header reveal fade-up">
            <div className="benefits-badge">
              <span className="benefits-badge-text">Tailored Solutions</span>
            </div>
            <h2 className="benefits-title">
              Personalized for <span className="benefits-title-gradient">Every Role</span>
            </h2>
            <p className="benefits-description">
              Our platform offers tailored features for each user role to ensure a seamless experience.
            </p>
          </div>

          <div className="benefits-content reveal fade-up">
            <div className="benefits-tabs">
              <div className="benefits-tab-buttons">
                {["students", "teachers", "management"].map((tab) => (
                  <button
                    key={tab}
                    className={`benefits-tab-button ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="benefits-tab-content">
                {activeTab === "students" && (
                  <div className="animate-fade-in">
                    <h3 className="benefits-tab-title">Student Benefits</h3>
                    <div className="benefits-features-grid">
                      {[
                        {
                          icon: Search,
                          title: "Explore Opportunities",
                          desc: "Discover internships that match your skills, interests, and academic requirements.",
                        },
                        {
                          icon: Clock,
                          title: "Track Progress",
                          desc: "Monitor your milestones, deadlines, and receive timely feedback from mentors.",
                        },
                        {
                          icon: FileText,
                          title: "Showcase Growth",
                          desc: "Generate professional reports highlighting your skills, growth, and SDG contributions.",
                        },
                        {
                          icon: Globe,
                          title: "SDG Alignment",
                          desc: "Connect your work to global sustainability goals and track your impact.",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.title}
                          className="benefits-feature-item"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="benefits-feature-icon">
                            <item.icon />
                          </div>
                          <div>
                            <h4 className="benefits-feature-title">{item.title}</h4>
                            <p className="benefits-feature-description">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "teachers" && (
                  <div className="animate-fade-in">
                    <h3 className="benefits-tab-title">Teacher Benefits</h3>
                    <div className="benefits-features-grid">
                      {[
                        {
                          icon: Users,
                          title: "Manage Mentorships",
                          desc: "Assign and oversee mentorships with intuitive tools for tracking student progress.",
                        },
                        {
                          icon: MessageSquare,
                          title: "Provide Evaluations",
                          desc: "Deliver detailed feedback and evaluations to help students grow professionally.",
                        },
                        {
                          icon: CheckCircle,
                          title: "Ensure Alignment",
                          desc: "Verify that internships align with academic goals, POs, and PEOs.",
                        },
                        {
                          icon: BarChart3,
                          title: "Track Department Progress",
                          desc: "Monitor department-wide internship statistics and student achievements.",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.title}
                          className="benefits-feature-item"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="benefits-feature-icon">
                            <item.icon />
                          </div>
                          <div>
                            <h4 className="benefits-feature-title">{item.title}</h4>
                            <p className="benefits-feature-description">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "management" && (
                  <div className="animate-fade-in">
                    <h3 className="benefits-tab-title">Management Benefits</h3>
                    <div className="benefits-features-grid">
                      {[
                        {
                          icon: BarChart3,
                          title: "Powerful Analytics",
                          desc: "Access comprehensive reports to assess institution-wide impacts and trends.",
                        },
                        {
                          icon: Users,
                          title: "Manage User Roles",
                          desc: "Assign and oversee user roles and permissions with secure access controls.",
                        },
                        {
                          icon: Building2,
                          title: "Industry Collaborations",
                          desc: "Track and enhance partnerships with industry leaders and employers.",
                        },
                        {
                          icon: Globe,
                          title: "SDG Impact Assessment",
                          desc: "Measure and report on the institution's contribution to sustainability goals.",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.title}
                          className="benefits-feature-item"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="benefits-feature-icon">
                            <item.icon />
                          </div>
                          <div>
                            <h4 className="benefits-feature-title">{item.title}</h4>
                            <p className="benefits-feature-description">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header reveal fade-up">
            <div className="faq-badge">
              <span className="faq-badge-text">Common Questions</span>
            </div>
            <h2 className="faq-title">
              Frequently Asked <span className="faq-title-gradient">Questions</span>
            </h2>
            <p className="faq-description">
              Find answers to the most common questions about our platform.
            </p>
          </div>

          <div className="faq-list reveal fade-up">
            {[
              {
                question: "How do I get started with InternHub?",
                answer:
                  "Getting started is easy! Simply click the 'Get Started' button, create an account, and follow the guided setup process based on your role (student, teacher, or administrator).",
              },
              {
                question: "Is InternHub free for students?",
                answer:
                  "Yes, InternHub is completely free for students. We believe in making internship opportunities accessible to all students without any financial barriers.",
              },
              {
                question: "How does the SDG mapping feature work?",
                answer:
                  "Our SDG mapping feature allows you to connect internship activities to specific Sustainable Development Goals. This helps track the impact of your work and align it with global sustainability initiatives.",
              },
              {
                question: "Can institutions customize the platform?",
                answer:
                  "InternHub offers extensive customization options for institutions, including branded interfaces, custom reporting templates, and integration with existing systems.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="faq-item reveal fade-up"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <details className="group">
                  <summary className="faq-question">
                    <h3 className="faq-question-text">{faq.question}</h3>
                    <div className="faq-icon-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="faq-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="faq-answer">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background"></div>

        <div className="cta-container">
          <div className="cta-card reveal fade-up">
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to Transform Your Internship Experience?
              </h2>
              <p className="cta-description">
                Join thousands of students, teachers, and institutions already benefiting from our platform.
              </p>
              <div className="cta-buttons">
                <button
                  onClick={() => navigate("/login")}
                  className="cta-primary-button"
                >
                  Get Started Now
                  <ChevronRight className="cta-icon" />
                </button>
                <a
                  href="#contact"
                  className="cta-secondary-button"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <Building2 className="footer-logo-icon" />
                <span className="footer-logo-text">InternHub</span>
              </div>
              <p className="footer-description">
                Revolutionizing internship management for students, faculty, employers, and institutions.
              </p>
              <div className="footer-social">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a key={social} href={`#${social}`} className="footer-social-link">
                    <span className="sr-only">{social}</span>
                    <div className="footer-social-icon">
                      <span className="footer-social-text">{social.charAt(0)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="footer-column-title">Resources</h3>
              <ul className="footer-links">
                {["Blog", "Documentation", "Guides", "Webinars"].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-column-title">Company</h3>
              <ul className="footer-links">
                {["About Us", "Careers", "Contact", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-column-title">Contact Us</h3>
              <form className="footer-form">
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="footer-input"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your message"
                    rows={3}
                    className="footer-textarea"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="footer-submit-button"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="footer-divider">
            <div className="footer-bottom">
              <p className="footer-copyright">&copy; {new Date().getFullYear()} InternHub. All Rights Reserved.</p>
              <p className="footer-credit">Designed with ❤️ for the future of education</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 