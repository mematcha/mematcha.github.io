import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon/Icon'
import styles from '../SectionPage.module.css'

const ResearchPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/ml" className={styles.navLink}>ML</Link>
          <Link to="/swe" className={styles.navLink}>SWE</Link>
          <Link to="/research" className={`${styles.navLink} ${styles.active}`}>Research</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Research</h1>
          <p className={styles.subtitle}>
            Projects emphasizing problem formulation, methodological rigor, research contributions, and academic context
          </p>
        </section>

        <section className={styles.content}>
          <div className={styles.project}>
            <h2>Graph-Based RAG System with Community Detection</h2>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}>
                <Icon name="Calendar" size={16} /> January - June 2025
              </span>
              <span className={styles.metaItem}>
                <Icon name="Tag" size={16} /> Graph Neural Networks, RAG, Clustering Algorithms
              </span>
            </div>
            
            <h3>Problem Formulation</h3>
            <p>
              Addressed the challenge of improving semantic relevance in Retrieval-Augmented Generation systems 
              for ESG reporting platforms. Traditional RAG systems often struggle with maintaining context coherence 
              across large document collections. The research question focused on whether graph-based representations 
              with community detection could improve document understanding accuracy and semantic relevance in 
              multi-document processing scenarios.
            </p>

            <h3>Methodology</h3>
            <p>
              Engineered and optimized a Graph-based RAG system using Louvain community detection algorithm to 
              identify document clusters and relationships. The methodology involved constructing knowledge graphs 
              from document collections, applying community detection to identify semantically related document groups, 
              and using these clusters to improve retrieval quality. Integrated with Large Language Models (LLMs) 
              and OpenAI Assistant API for generation, with rigorous evaluation of semantic relevance metrics.
            </p>

            <h3>Contributions & Impact</h3>
            <p>
              Improved semantic relevance by 45% and document understanding accuracy through advanced clustering 
              algorithms. The graph-based approach enabled better context preservation across related documents, 
              leading to more coherent and accurate generated content. This work was applied in a production-ready 
              ESG reporting platform for a multinational client, demonstrating practical impact. The methodology 
              can be extended to other document understanding and RAG applications.
            </p>

            <div className={styles.perspectives}>
              <Link to="/ml" className={styles.perspectiveLink}>
                View ML Perspective <Icon name="ArrowRight" size={16} />
              </Link>
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

export default ResearchPage

