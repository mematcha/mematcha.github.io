import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon/Icon'
import styles from '../SectionPage.module.css'

const SWEPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/ml" className={styles.navLink}>ML</Link>
          <Link to="/swe" className={`${styles.navLink} ${styles.active}`}>SWE</Link>
          <Link to="/research" className={styles.navLink}>Research</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Software Engineering</h1>
          <p className={styles.subtitle}>
            Projects emphasizing system design, code quality, architecture decisions, and engineering practices
          </p>
        </section>

        <section className={styles.content}>
          <div className={styles.project}>
            <h2>Large-Scale Document Understanding Pipeline</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> October 2025
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> Production Systems, Batch Processing, Microservices
              </span>
            </div>
            
            <h3>System Design</h3>
            <p>
              Designed a production-scale microservice architecture for document processing with batch 
              processing capabilities handling 250 PDFs/hour. Implemented robust quality assessment and 
              fallback pipelines with confidence scoring and OCR validation. The system uses a modular 
              architecture with five extraction engines (rule-based, tabular, deep learning, OCR, Google 
              Document AI) that can be orchestrated based on document complexity and confidence thresholds.
            </p>

            <h3>Code Quality & Practices</h3>
            <p>
              Developed and maintained robust error handling and monitoring systems. Implemented comprehensive 
              logging and metrics collection for production observability. Built quality assessment pipelines 
              that automatically validate extraction results and trigger fallback mechanisms when confidence 
              scores are low. The codebase follows production ML best practices with proper abstraction layers 
              and modular design.
            </p>

            <h3>Technical Stack</h3>
            <p>
              Python with PyTorch for ML components, integrated with Google Document AI API. Built export 
              capabilities for JSON, CSV, and Markdown formats. Designed for deployment on cloud infrastructure 
              with Docker containerization. The system architecture supports horizontal scaling and can handle 
              varying document loads efficiently.
            </p>

            <div className={styles.perspectives}>
              <Link to="/ml" className={styles.perspectiveLink}>
                View ML Perspective <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div className={styles.project}>
            <h2>Project Aurelia — RAG Microservice</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> October 2025
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> FastAPI, Streamlit, Scalable APIs, Monitoring
              </span>
            </div>
            
            <h3>System Design</h3>
            <p>
              Engineered a scalable microservice architecture with FastAPI backend and Streamlit frontend, 
              designed to handle 10,000+ queries per month. The system implements semantic search over 1,500+ 
              document chunks with 4-second response time. Built with horizontal scalability in mind, using 
              vector database (Pinecone) for efficient similarity search and implementing neural reranking 
              for improved relevance.
            </p>

            <h3>Code Quality & Practices</h3>
            <p>
              Built comprehensive system health monitoring and metrics collection. Implemented full observability 
              stack to track query success rates, response times, and system performance. Designed robust error 
              handling with Wikipedia fallback mechanisms for comprehensive topic coverage. The API follows RESTful 
              principles with proper status codes and error responses.
            </p>

            <h3>Technical Stack</h3>
            <p>
              FastAPI for high-performance async backend, Streamlit for interactive frontend. Integrated OpenAI 
              GPT-4o API, Pinecone vector database, and custom neural reranking models. Built with Python, 
              leveraging async/await patterns for concurrent request handling. The system is containerized and 
              ready for cloud deployment with proper environment configuration management.
            </p>

            <div className={styles.perspectives}>
              <Link to="/ml" className={styles.perspectiveLink}>
                View ML Perspective <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div className={styles.project}>
            <h2>Real-Time Trading Platform — 5Paisa Capital</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> June 2021 - July 2023
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> React, WebSockets, Real-time Systems, Performance Optimization
              </span>
            </div>
            
            <h3>System Design</h3>
            <p>
              Developed and deployed real-time personalization features for a high-traffic derivatives trading 
              platform serving 10,000+ monthly active users. Optimized performance and scalability of real-time 
              data processing pipeline handling 1,500+ concurrent users. Implemented WebSocket-based architecture 
              for low-latency data delivery and real-time updates.
            </p>

            <h3>Code Quality & Practices</h3>
            <p>
              Implemented caching strategies and load balancing that reduced server response time by 40%. 
              Developed React-based frontend components optimized for real-time data rendering. Built robust 
              error handling and reconnection logic for WebSocket connections. Followed best practices for 
              high-traffic systems with proper monitoring and alerting.
            </p>

            <h3>Technical Stack</h3>
            <p>
              React for frontend development, WebSockets for real-time communication, implemented caching 
              layers using Redis. Built with JavaScript/TypeScript, focusing on performance optimization 
              and user experience. The system architecture supports high concurrency with efficient resource 
              utilization.
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Sai Sathwik Matcha. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default SWEPage

