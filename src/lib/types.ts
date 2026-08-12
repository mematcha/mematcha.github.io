export type Status = 'draft' | 'published'
export type DemoType = 'iframe' | 'link'

export interface SocialLink {
  label: string
  url: string
  icon?: string
}

export interface Profile {
  id: string
  name: string
  tagline: string
  bio: string
  profile_image_url: string
  social_links: SocialLink[]
  updated_at?: string
  updated_by_email?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  location: string
  date_range: string
  sort_order: number
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  date_range: string
  bullets: string[]
  sort_order: number
}

export interface SkillCategory {
  id: string
  name: string
  items: string[]
  sort_order: number
}

export interface ProjectHeading {
  title: string
  body: string
}

export interface PerspectiveContent {
  date: string
  tags: string[]
  headings: ProjectHeading[]
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  ml_content?: PerspectiveContent | null
  swe_content?: PerspectiveContent | null
  research_content?: PerspectiveContent | null
  tags: string[]
  featured: boolean
  status: Status
  published_at?: string | null
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  body_markdown: string
  cover_image_url: string
  tags: string[]
  status: Status
  published_at?: string | null
}

export interface Demo {
  id: string
  slug: string
  title: string
  description: string
  demo_type: DemoType
  demo_url: string
  repo_url: string
  project_id?: string | null
  status: Status
}

export interface MediaItem {
  id: string
  gcs_path: string
  public_url: string
  content_type: string
  uploaded_at?: string
}
