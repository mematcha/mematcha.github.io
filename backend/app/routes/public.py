"""Public, unauthenticated read API.

Returns only published projects, posts, and demos; semi-static content
(profile, education, experience, skills) is always returned.
"""

from fastapi import APIRouter, Depends, HTTPException

from ..deps import get_content_service
from ..services.content import (
    DEMOS,
    EDUCATION,
    EXPERIENCE,
    POSTS,
    PROJECTS,
    SKILLS,
    ContentService,
)

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/profile")
def get_profile(svc: ContentService = Depends(get_content_service)):
    profile = svc.get_profile()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not configured")
    return profile


@router.get("/education")
def list_education(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(EDUCATION, order_by="sort_order")


@router.get("/experience")
def list_experience(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(EXPERIENCE, order_by="sort_order")


@router.get("/skills")
def list_skills(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(SKILLS, order_by="sort_order")


@router.get("/projects")
def list_projects(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(PROJECTS, order_by="published_at", descending=True)


@router.get("/projects/{slug}")
def get_project(slug: str, svc: ContentService = Depends(get_content_service)):
    doc = svc.get_public_by_slug(PROJECTS, slug)
    if doc is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return doc


@router.get("/posts")
def list_posts(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(POSTS, order_by="published_at", descending=True)


@router.get("/posts/{slug}")
def get_post(slug: str, svc: ContentService = Depends(get_content_service)):
    doc = svc.get_public_by_slug(POSTS, slug)
    if doc is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return doc


@router.get("/demos")
def list_demos(svc: ContentService = Depends(get_content_service)):
    return svc.list_public(DEMOS, order_by="published_at", descending=True)


@router.get("/demos/{slug}")
def get_demo(slug: str, svc: ContentService = Depends(get_content_service)):
    doc = svc.get_public_by_slug(DEMOS, slug)
    if doc is None:
        raise HTTPException(status_code=404, detail="Demo not found")
    return doc
