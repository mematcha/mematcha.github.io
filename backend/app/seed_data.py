"""Seed content mirrored from the original hardcoded pages.

This is the single source of truth used to populate both the in-memory mock
store (local dev) and Firestore (initial production seed), so the CMS opens
with the current site content already present.
"""

from datetime import datetime, timezone

_NOW = datetime.now(timezone.utc)

PROFILE = {
    "id": "profile",
    "name": "Sathwik Matcha",
    "tagline": "Machine Learning Engineer | Software Engineer",
    "bio": (
        "I'm a Machine Learning Engineer and Software Engineer with expertise in production ML "
        "systems, natural language processing, and large-scale document understanding. Currently "
        "pursuing a Master of Science in Information Systems at Northeastern University (expected "
        "Dec 2025), with a Bachelor of Technology from the Indian Institute of Technology Bombay. "
        "I specialize in building production-grade ML systems, working with Large Language Models, "
        "and developing scalable microservices for document processing and retrieval-augmented "
        "generation."
    ),
    "profile_image_url": "/images/profile/profile.jpg",
    "social_links": [
        {"label": "Email", "url": "mailto:matcha.s@northeastern.edu", "icon": "Mail"},
        {"label": "GitHub", "url": "https://github.com/mematcha", "icon": "Github"},
        {"label": "LinkedIn", "url": "https://linkedin.com/in/sathwik-matcha", "icon": "Linkedin"},
    ],
    "updated_at": _NOW,
    "updated_by_email": "seed",
}

EDUCATION = [
    {
        "institution": "Northeastern University",
        "degree": "Master of Science in Information Systems",
        "location": "Boston, MA",
        "date_range": "Expected Dec 2025",
        "sort_order": 0,
    },
    {
        "institution": "Indian Institute of Technology Bombay",
        "degree": "Bachelor of Technology",
        "location": "Mumbai, India",
        "date_range": "Aug 2021",
        "sort_order": 1,
    },
]

EXPERIENCE = [
    {
        "title": "AI Engineer Intern",
        "company": "Gaman AI (Aousenuma) – Remote",
        "location": "Remote",
        "date_range": "Jan 2025 – June 2025",
        "bullets": [
            "Worked with a cross-functional team of 4 engineers and product stakeholders to design, "
            "develop, and deploy a production-ready ESG reporting platform for a multinational client, "
            "processing multiple documents using Large Language Models (LLMs) and OpenAI Assistant API.",
            "Engineered and optimized Graph-based RAG system with Louvain community detection, "
            "improving semantic relevance by 45% and document understanding accuracy through advanced "
            "clustering algorithms.",
        ],
        "sort_order": 0,
    },
    {
        "title": "Software Engineer",
        "company": "5Paisa Capital Limited – Mumbai, India",
        "location": "Mumbai, India",
        "date_range": "June 2021 – July 2023",
        "bullets": [
            "Developed and deployed real-time personalization features for a high-traffic derivatives "
            "trading platform serving 10,000+ monthly active users, leveraging WebSockets and React "
            "for low-latency user experiences.",
            "Optimized performance and scalability of real-time data processing pipeline handling "
            "1,500+ concurrent users, implementing caching strategies and load balancing that reduced "
            "server response time by 40%.",
        ],
        "sort_order": 1,
    },
]

SKILLS = [
    {
        "name": "Machine Learning",
        "items": [
            "PyTorch & Transformers",
            "Large Language Models (LLMs)",
            "RAG & Graph Neural Networks",
            "NLP & Document Understanding",
            "Model Optimization",
        ],
        "sort_order": 0,
    },
    {
        "name": "Software Engineering",
        "items": [
            "Python, JavaScript, TypeScript",
            "FastAPI, Flask, Next.js",
            "Docker & CI/CD Pipelines",
            "System Design & Scalability",
            "Real-time Systems (WebSockets)",
        ],
        "sort_order": 1,
    },
    {
        "name": "Infrastructure & Data",
        "items": [
            "GCP, Docker, Airflow",
            "Neo4j, Supabase, Redis",
            "NumPy, Pandas, Dask",
            "GitHub Actions",
            "Production ML Systems",
        ],
        "sort_order": 2,
    },
]

PROJECTS = [
    {
        "slug": "document-understanding-transformers",
        "title": "Large-Scale Document Understanding with Multi-Modal Transformers",
        "summary": (
            "Production-scale document processing pipeline for SEC financial filings using LayoutLMv3 "
            "multimodal transformer, achieving 92% accuracy on complex multi-column documents."
        ),
        "tags": ["LayoutLMv3", "Multi-Modal Transformers", "Document Understanding"],
        "featured": True,
        "status": "published",
        "published_at": _NOW,
        "updated_at": _NOW,
        "updated_by_email": "seed",
        "ml_content": {
            "date": "October 2025",
            "tags": ["LayoutLMv3", "Multi-Modal Transformers", "Document Understanding"],
            "headings": [
                {"title": "Modeling Approach", "body": (
                    "Architected a production-scale document processing pipeline using LayoutLMv3 "
                    "multimodal transformer for processing SEC financial filings (10-K, 10-Q). "
                    "Leveraged LayoutParser for deep learning-based layout detection to handle complex "
                    "multi-column documents. The model architecture was specifically chosen for its "
                    "ability to understand both textual and visual layout information simultaneously, "
                    "which is critical for financial document parsing.")},
                {"title": "Evaluation & Metrics", "body": (
                    "Achieved 92% accuracy on complex multi-column document processing. Integrated five "
                    "advanced extraction engines (rule-based, tabular, deep learning, OCR, and Google "
                    "Document AI) with confidence scoring mechanisms. This multi-engine approach boosted "
                    "table fidelity by 35% and reduced manual correction requirements by over 50%.")},
                {"title": "Technical Implementation", "body": (
                    "Built using PyTorch with LayoutLMv3 for multimodal understanding. Developed batch "
                    "processing capabilities handling 250 PDFs/hour with robust fallback pipelines. "
                    "Exported results in multiple formats (JSON, CSV, Markdown) for downstream analytics.")},
            ],
        },
        "swe_content": {
            "date": "October 2025",
            "tags": ["Production Systems", "Batch Processing", "Microservices"],
            "headings": [
                {"title": "System Design", "body": (
                    "Designed a production-scale microservice architecture for document processing with "
                    "batch processing capabilities handling 250 PDFs/hour. Implemented robust quality "
                    "assessment and fallback pipelines with confidence scoring and OCR validation.")},
                {"title": "Code Quality & Practices", "body": (
                    "Developed and maintained robust error handling and monitoring systems. Implemented "
                    "comprehensive logging and metrics collection for production observability.")},
                {"title": "Technical Stack", "body": (
                    "Python with PyTorch for ML components, integrated with Google Document AI API. Built "
                    "export capabilities for JSON, CSV, and Markdown formats. Designed for deployment on "
                    "cloud infrastructure with Docker containerization.")},
            ],
        },
        "research_content": None,
    },
    {
        "slug": "project-aurelia-rag",
        "title": "Project Aurelia — Production-Grade RAG Microservice",
        "summary": (
            "Engineered microservice for auto-generating financial concept notes with semantic search "
            "over 1,500+ document chunks, achieving 88% search relevance and 4s response time."
        ),
        "tags": ["RAG", "LLMs", "OpenAI GPT-4o", "Pinecone", "Neural Reranking"],
        "featured": True,
        "status": "published",
        "published_at": _NOW,
        "updated_at": _NOW,
        "updated_by_email": "seed",
        "ml_content": {
            "date": "October 2025",
            "tags": ["RAG", "LLMs", "OpenAI GPT-4o", "Pinecone", "Neural Reranking"],
            "headings": [
                {"title": "Modeling Approach", "body": (
                    "Engineered a microservice to auto-generate standardized financial concept notes "
                    "using Retrieval-Augmented Generation (RAG). Implemented advanced RAG pipeline with "
                    "OpenAI GPT-4o and Pinecone vector database for semantic search over 1,500+ document "
                    "chunks. Integrated neural reranking to improve search relevance.")},
                {"title": "Evaluation & Metrics", "body": (
                    "Achieved 88% search relevance and 95% query answer rate across 10,000+ monthly "
                    "queries. The system maintains 4-second response time for semantic search operations.")},
                {"title": "Technical Implementation", "body": (
                    "Built with FastAPI backend and Streamlit frontend, designed to handle 10,000+ "
                    "queries per month. Integrated OpenAI GPT-4o for generation, Pinecone for vector "
                    "similarity search, and custom neural reranking models.")},
            ],
        },
        "swe_content": {
            "date": "October 2025",
            "tags": ["FastAPI", "Streamlit", "Scalable APIs", "Monitoring"],
            "headings": [
                {"title": "System Design", "body": (
                    "Engineered a scalable microservice architecture with FastAPI backend and Streamlit "
                    "frontend, designed to handle 10,000+ queries per month. Built with horizontal "
                    "scalability in mind, using vector database (Pinecone) for efficient similarity search.")},
                {"title": "Code Quality & Practices", "body": (
                    "Built comprehensive system health monitoring and metrics collection. Implemented "
                    "full observability stack to track query success rates, response times, and system "
                    "performance.")},
                {"title": "Technical Stack", "body": (
                    "FastAPI for high-performance async backend, Streamlit for interactive frontend. "
                    "Integrated OpenAI GPT-4o API, Pinecone vector database, and custom neural reranking "
                    "models.")},
            ],
        },
        "research_content": None,
    },
    {
        "slug": "graph-rag-community-detection",
        "title": "Graph-Based RAG System with Community Detection",
        "summary": (
            "Graph-based RAG system using Louvain community detection to improve semantic relevance by "
            "45% for an ESG reporting platform."
        ),
        "tags": ["Graph Neural Networks", "RAG", "Clustering Algorithms"],
        "featured": False,
        "status": "published",
        "published_at": _NOW,
        "updated_at": _NOW,
        "updated_by_email": "seed",
        "ml_content": None,
        "swe_content": None,
        "research_content": {
            "date": "January - June 2025",
            "tags": ["Graph Neural Networks", "RAG", "Clustering Algorithms"],
            "headings": [
                {"title": "Problem Formulation", "body": (
                    "Addressed the challenge of improving semantic relevance in Retrieval-Augmented "
                    "Generation systems for ESG reporting platforms. The research question focused on "
                    "whether graph-based representations with community detection could improve document "
                    "understanding accuracy and semantic relevance in multi-document processing scenarios.")},
                {"title": "Methodology", "body": (
                    "Engineered and optimized a Graph-based RAG system using Louvain community detection "
                    "algorithm to identify document clusters and relationships. Constructed knowledge "
                    "graphs from document collections and used clusters to improve retrieval quality.")},
                {"title": "Contributions & Impact", "body": (
                    "Improved semantic relevance by 45% and document understanding accuracy through "
                    "advanced clustering algorithms. Applied in a production-ready ESG reporting platform "
                    "for a multinational client, demonstrating practical impact.")},
            ],
        },
    },
]

POSTS = [
    {
        "slug": "welcome",
        "title": "Welcome to my new blog",
        "excerpt": "A short note on why I rebuilt this site with a CMS.",
        "body_markdown": (
            "# Welcome\n\n"
            "This site is now backed by a small FastAPI service and Firestore, so I can write "
            "and publish posts without editing code.\n\n"
            "Expect write-ups on ML systems, RAG, and production engineering."
        ),
        "cover_image_url": "",
        "tags": ["meta"],
        "status": "published",
        "published_at": _NOW,
        "updated_at": _NOW,
        "updated_by_email": "seed",
    },
]

DEMOS: list[dict] = []
