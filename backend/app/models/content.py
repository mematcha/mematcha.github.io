"""Pydantic models describing the CMS content types.

Each dynamic collection (projects, posts, demos) carries a publication status
plus audit fields that the admin API stamps on every write. The public API only
ever returns documents whose status is `published`.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Status(str, Enum):
    draft = "draft"
    published = "published"


class DemoType(str, Enum):
    iframe = "iframe"
    link = "link"


class SocialLink(BaseModel):
    label: str
    url: str
    icon: str = ""


class ProfileIn(BaseModel):
    name: str
    tagline: str = ""
    bio: str = ""
    profile_image_url: str = ""
    social_links: list[SocialLink] = Field(default_factory=list)


class Profile(ProfileIn):
    id: str = "profile"
    updated_at: Optional[datetime] = None
    updated_by_email: Optional[str] = None


class EducationIn(BaseModel):
    institution: str
    degree: str
    location: str = ""
    date_range: str = ""
    sort_order: int = 0


class Education(EducationIn):
    id: str


class ExperienceIn(BaseModel):
    title: str
    company: str
    location: str = ""
    date_range: str = ""
    bullets: list[str] = Field(default_factory=list)
    sort_order: int = 0


class Experience(ExperienceIn):
    id: str


class SkillCategoryIn(BaseModel):
    name: str
    items: list[str] = Field(default_factory=list)
    sort_order: int = 0


class SkillCategory(SkillCategoryIn):
    id: str


class ProjectHeading(BaseModel):
    title: str
    body: str


class PerspectiveContent(BaseModel):
    date: str = ""
    tags: list[str] = Field(default_factory=list)
    headings: list[ProjectHeading] = Field(default_factory=list)


class ProjectIn(BaseModel):
    slug: str = ""
    title: str
    summary: str = ""
    ml_content: Optional[PerspectiveContent] = None
    swe_content: Optional[PerspectiveContent] = None
    research_content: Optional[PerspectiveContent] = None
    tags: list[str] = Field(default_factory=list)
    featured: bool = False
    status: Status = Status.draft


class Project(ProjectIn):
    id: str
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    updated_by_email: Optional[str] = None


class PostIn(BaseModel):
    slug: str = ""
    title: str
    excerpt: str = ""
    body_markdown: str = ""
    cover_image_url: str = ""
    tags: list[str] = Field(default_factory=list)
    status: Status = Status.draft


class Post(PostIn):
    id: str
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    updated_by_email: Optional[str] = None


class DemoIn(BaseModel):
    slug: str = ""
    title: str
    description: str = ""
    demo_type: DemoType = DemoType.link
    demo_url: str = ""
    repo_url: str = ""
    project_id: Optional[str] = None
    status: Status = Status.draft


class Demo(DemoIn):
    id: str
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    updated_by_email: Optional[str] = None


class MediaItem(BaseModel):
    id: str
    gcs_path: str
    public_url: str
    content_type: str = ""
    uploaded_by_email: Optional[str] = None
    uploaded_at: Optional[datetime] = None


class UploadUrlRequest(BaseModel):
    filename: str
    content_type: str = "application/octet-stream"


class UploadUrlResponse(BaseModel):
    upload_url: str
    public_url: str
    gcs_path: str
    method: str = "PUT"
