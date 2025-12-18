import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon/Icon'
import styles from '../SectionPage.module.css'

const MLPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/ml" className={`${styles.navLink} ${styles.active}`}>ML</Link>
          <Link to="/swe" className={styles.navLink}>SWE</Link>
          <Link to="/research" className={styles.navLink}>Research</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Machine Learning</h1>
          <p className={styles.subtitle}>
            Projects emphasizing modeling choices, evaluation metrics, and ML-specific technical depth
          </p>
        </section>

        <section className={styles.content}>
          <div className={styles.project}>
            <h2>Large-Scale Document Understanding with Multi-Modal Transformers</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> October 2025
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> LayoutLMv3, Multi-Modal Transformers, Document Understanding
              </span>
            </div>
            
            <h3>Modeling Approach</h3>
            <p>
              Architected a production-scale document processing pipeline using LayoutLMv3 multimodal transformer 
              for processing SEC financial filings (10-K, 10-Q). Leveraged LayoutParser for deep learning-based 
              layout detection to handle complex multi-column documents. The model architecture was specifically 
              chosen for its ability to understand both textual and visual layout information simultaneously, 
              which is critical for financial document parsing.
            </p>

            <h3>Evaluation & Metrics</h3>
            <p>
              Achieved 92% accuracy on complex multi-column document processing. Integrated five advanced 
              extraction engines (rule-based, tabular, deep learning, OCR, and Google Document AI) with 
              confidence scoring mechanisms. This multi-engine approach boosted table fidelity by 35% and 
              reduced manual correction requirements by over 50%. Implemented robust quality assessment 
              pipelines to ensure high-confidence outputs.
            </p>

            <h3>Technical Implementation</h3>
            <p>
              Built using PyTorch with LayoutLMv3 for multimodal understanding. Developed batch processing 
              capabilities handling 250 PDFs/hour with robust fallback pipelines. Implemented OCR quality 
              checks and confidence scoring to ensure reliable extraction. Exported results in multiple formats 
              (JSON, CSV, Markdown) for downstream analytics. The system was designed for production deployment 
              with monitoring and error handling.
            </p>

            <div className={styles.perspectives}>
              <Link to="/swe" className={styles.perspectiveLink}>
                View SWE Perspective <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div className={styles.project}>
            <h2>Project Aurelia — Production-Grade Retrieval-Augmented Generation Microservice</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> October 2025
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> RAG, LLMs, OpenAI GPT-4o, Pinecone, Neural Reranking
              </span>
            </div>
            
            <h3>Modeling Approach</h3>
            <p>
              Engineered a microservice to auto-generate standardized financial concept notes using 
              Retrieval-Augmented Generation (RAG). Implemented advanced RAG pipeline with OpenAI GPT-4o 
              and Pinecone vector database for semantic search over 1,500+ document chunks. Integrated neural 
              reranking to improve search relevance and Wikipedia fallback mechanisms for comprehensive topic 
              coverage.
            </p>

            <h3>Evaluation & Metrics</h3>
            <p>
              Achieved 88% search relevance and 95% query answer rate across 10,000+ monthly queries. 
              The system maintains 4-second response time for semantic search operations. Neural reranking 
              significantly improved the quality of retrieved context, leading to more accurate and relevant 
              generated content. Comprehensive monitoring tracks query success rates and system performance.
            </p>

            <h3>Technical Implementation</h3>
            <p>
              Built with FastAPI backend and Streamlit frontend, designed to handle 10,000+ queries per month. 
              Integrated OpenAI GPT-4o for generation, Pinecone for vector similarity search, and custom 
              neural reranking models. Implemented full system health monitoring and metrics collection. 
              The architecture supports scalable document chunking and efficient retrieval, with fallback 
              mechanisms for edge cases.
            </p>

            <div className={styles.perspectives}>
              <Link to="/swe" className={styles.perspectiveLink}>
                View SWE Perspective <Icon name="ArrowRight" size={16} />
              </Link>
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

export default MLPage

