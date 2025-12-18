import React from 'react'
import { Link } from 'react-router-dom'
import ProfileImage from '../components/ProfileImage/ProfileImage'
import Icon from '../components/Icon/Icon'
import placeholderImage from '../assets/images/profile/placeholder.svg'
import styles from './HomePage.module.css'

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#education" className={styles.navLink}>Education</a>
          <a href="#experience" className={styles.navLink}>Experience</a>
          <Link to="/ml" className={styles.navLink}>ML</Link>
          <Link to="/swe" className={styles.navLink}>SWE</Link>
          <Link to="/research" className={styles.navLink}>Research</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section id="home" className={styles.hero}>
          <ProfileImage
            src={`${import.meta.env.BASE_URL}images/profile/profile.jpg`}
            alt="Profile picture"
            fallbackSrc={placeholderImage}
            loading="eager"
          />
          <h1 className={styles.name}>Sathwik Matcha</h1>
          <p className={styles.tagline}>Machine Learning Engineer | Software Engineer</p>
          
          <div className={styles.socialLinks}>
            <a href="mailto:matcha.s@northeastern.edu" aria-label="Email">
              <Icon name="Mail" size={24} ariaLabel="Email" />
            </a>
            <a href="https://github.com/mematcha" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <Icon name="Github" size={24} ariaLabel="GitHub" />
            </a>
            <a href="https://linkedin.com/in/sathwik-matcha" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Icon name="Linkedin" size={24} ariaLabel="LinkedIn" />
            </a>
          </div>
        </section>

        <section className={styles.overview}>
          <h2>Background</h2>
          <p>
            I'm a Machine Learning Engineer and Software Engineer with expertise in production ML systems, 
            natural language processing, and large-scale document understanding. Currently pursuing a Master of Science 
            in Information Systems at Northeastern University (expected Dec 2025), with a Bachelor of Technology 
            from the Indian Institute of Technology Bombay. I specialize in building production-grade ML systems, 
            working with Large Language Models, and developing scalable microservices for document processing and 
            retrieval-augmented generation.
          </p>
        </section>

        <section className={styles.skills}>
          <h2>Core Skills</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillCategory}>
              <h3>Machine Learning</h3>
              <ul>
                <li>PyTorch & Transformers</li>
                <li>Large Language Models (LLMs)</li>
                <li>RAG & Graph Neural Networks</li>
                <li>NLP & Document Understanding</li>
                <li>Model Optimization</li>
              </ul>
            </div>
            <div className={styles.skillCategory}>
              <h3>Software Engineering</h3>
              <ul>
                <li>Python, JavaScript, TypeScript</li>
                <li>FastAPI, Flask, Next.js</li>
                <li>Docker & CI/CD Pipelines</li>
                <li>System Design & Scalability</li>
                <li>Real-time Systems (WebSockets)</li>
              </ul>
            </div>
            <div className={styles.skillCategory}>
              <h3>Infrastructure & Data</h3>
              <ul>
                <li>GCP, Docker, Airflow</li>
                <li>Neo4j, Supabase, Redis</li>
                <li>NumPy, Pandas, Dask</li>
                <li>GitHub Actions</li>
                <li>Production ML Systems</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.work}>
          <h2>Representative Work</h2>
          <div className={styles.projectsGrid}>
            <div className={styles.projectCard}>
              <h3>Large-Scale Document Understanding with Multi-Modal Transformers</h3>
              <p>
                Production-scale document processing pipeline for SEC financial filings using LayoutLMv3 
                multimodal transformer, achieving 92% accuracy on complex multi-column documents.
              </p>
              <div className={styles.projectLinks}>
                <Link to="/ml" className={styles.viewLink}>
                  View ML Perspective <Icon name="ArrowRight" size={16} />
                </Link>
                <Link to="/swe" className={styles.viewLink}>
                  View SWE Perspective <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>
            <div className={styles.projectCard}>
              <h3>Project Aurelia — Production-Grade RAG Microservice</h3>
              <p>
                Engineered microservice for auto-generating financial concept notes with semantic search 
                over 1,500+ document chunks, achieving 88% search relevance and 4s response time.
              </p>
              <div className={styles.projectLinks}>
                <Link to="/ml" className={styles.viewLink}>
                  View ML Perspective <Icon name="ArrowRight" size={16} />
                </Link>
                <Link to="/swe" className={styles.viewLink}>
                  View SWE Perspective <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className={styles.education}>
          <h2>Education</h2>
          <div className={styles.educationList}>
            <div className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <h3>Northeastern University</h3>
                <span className={styles.location}>Boston, MA</span>
              </div>
              <div className={styles.educationDetails}>
                <p className={styles.degree}>Master of Science in Information Systems</p>
                <p className={styles.date}>Expected Dec 2025</p>
              </div>
            </div>
            <div className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <h3>Indian Institute of Technology Bombay</h3>
                <span className={styles.location}>Mumbai, India</span>
              </div>
              <div className={styles.educationDetails}>
                <p className={styles.degree}>Bachelor of Technology</p>
                <p className={styles.date}>Aug 2021</p>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className={styles.experience}>
          <h2>Work Experience</h2>
          <div className={styles.experienceList}>
            <div className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <div>
                  <h3>AI Engineer Intern</h3>
                  <p className={styles.company}>Gaman AI (Aousenuma) – Remote</p>
                </div>
                <span className={styles.dateRange}>Jan 2025 – June 2025</span>
              </div>
              <ul className={styles.experienceBullets}>
                <li>
                  Worked with a cross-functional team of 4 engineers and product stakeholders to design, 
                  develop, and deploy a production-ready ESG reporting platform for a multinational client, 
                  processing multiple documents using Large Language Models (LLMs) and OpenAI Assistant API.
                </li>
                <li>
                  Engineered and optimized Graph-based RAG system with Louvain community detection, 
                  improving semantic relevance by 45% and document understanding accuracy through advanced 
                  clustering algorithms.
                </li>
              </ul>
            </div>
            <div className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <div>
                  <h3>Software Engineer</h3>
                  <p className={styles.company}>5Paisa Capital Limited – Mumbai, India</p>
                </div>
                <span className={styles.dateRange}>June 2021 – July 2023</span>
              </div>
              <ul className={styles.experienceBullets}>
                <li>
                  Developed and deployed real-time personalization features for a high-traffic derivatives 
                  trading platform serving 10,000+ monthly active users, leveraging WebSockets and React 
                  for low-latency user experiences.
                </li>
                <li>
                  Optimized performance and scalability of real-time data processing pipeline handling 
                  1,500+ concurrent users, implementing caching strategies and load balancing that 
                  reduced server response time by 40%.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Sai Sathwik Matcha. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage
