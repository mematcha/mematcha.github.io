"""Authenticated CMS admin API.

All routes require a valid bearer token whose email is on the allowlist
(see `require_admin`). These endpoints are the sole writers to the database.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException

from ..auth.firebase import AdminUser, require_admin
from ..config import Settings, get_settings
from ..connectors.base import StorageConnector
from ..deps import get_content_service, get_storage_connector
from ..models.content import (
    DemoIn,
    EducationIn,
    ExperienceIn,
    PostIn,
    ProfileIn,
    ProjectIn,
    SkillCategoryIn,
    UploadUrlRequest,
    UploadUrlResponse,
)
from ..services.content import (
    DEMOS,
    EDUCATION,
    EXPERIENCE,
    MEDIA,
    POSTS,
    PROJECTS,
    SKILLS,
    ContentService,
)

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/me")
def whoami(user: AdminUser = Depends(require_admin)):
    return {"email": user.email, "uid": user.uid}


# ---- Profile ---------------------------------------------------------------


@router.put("/profile")
def set_profile(
    body: ProfileIn,
    user: AdminUser = Depends(require_admin),
    svc: ContentService = Depends(get_content_service),
):
    return svc.set_profile(body.model_dump(), user.email)


# ---- Generic helpers for ordered semi-static collections -------------------


def _list(collection: str, svc: ContentService, order_by: str = "sort_order"):
    return svc.list_all(collection, order_by=order_by)


def _create(collection: str, data: dict, user: AdminUser, svc: ContentService):
    return svc.create(collection, data, user.email)


def _update(collection: str, doc_id: str, data: dict, user: AdminUser, svc: ContentService):
    updated = svc.update(collection, doc_id, data, user.email)
    if updated is None:
        raise HTTPException(status_code=404, detail=f"{collection} item not found")
    return updated


def _delete(collection: str, doc_id: str, svc: ContentService):
    if not svc.delete(collection, doc_id):
        raise HTTPException(status_code=404, detail=f"{collection} item not found")
    return {"deleted": True, "id": doc_id}


# ---- Education -------------------------------------------------------------


@router.get("/education")
def list_education(svc: ContentService = Depends(get_content_service)):
    return _list(EDUCATION, svc)


@router.post("/education")
def create_education(body: EducationIn, user: AdminUser = Depends(require_admin),
                     svc: ContentService = Depends(get_content_service)):
    return _create(EDUCATION, body.model_dump(), user, svc)


@router.put("/education/{doc_id}")
def update_education(doc_id: str, body: EducationIn, user: AdminUser = Depends(require_admin),
                     svc: ContentService = Depends(get_content_service)):
    return _update(EDUCATION, doc_id, body.model_dump(), user, svc)


@router.delete("/education/{doc_id}")
def delete_education(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(EDUCATION, doc_id, svc)


# ---- Experience ------------------------------------------------------------


@router.get("/experience")
def list_experience(svc: ContentService = Depends(get_content_service)):
    return _list(EXPERIENCE, svc)


@router.post("/experience")
def create_experience(body: ExperienceIn, user: AdminUser = Depends(require_admin),
                      svc: ContentService = Depends(get_content_service)):
    return _create(EXPERIENCE, body.model_dump(), user, svc)


@router.put("/experience/{doc_id}")
def update_experience(doc_id: str, body: ExperienceIn, user: AdminUser = Depends(require_admin),
                      svc: ContentService = Depends(get_content_service)):
    return _update(EXPERIENCE, doc_id, body.model_dump(), user, svc)


@router.delete("/experience/{doc_id}")
def delete_experience(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(EXPERIENCE, doc_id, svc)


# ---- Skills ----------------------------------------------------------------


@router.get("/skills")
def list_skills(svc: ContentService = Depends(get_content_service)):
    return _list(SKILLS, svc)


@router.post("/skills")
def create_skill(body: SkillCategoryIn, user: AdminUser = Depends(require_admin),
                 svc: ContentService = Depends(get_content_service)):
    return _create(SKILLS, body.model_dump(), user, svc)


@router.put("/skills/{doc_id}")
def update_skill(doc_id: str, body: SkillCategoryIn, user: AdminUser = Depends(require_admin),
                 svc: ContentService = Depends(get_content_service)):
    return _update(SKILLS, doc_id, body.model_dump(), user, svc)


@router.delete("/skills/{doc_id}")
def delete_skill(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(SKILLS, doc_id, svc)


# ---- Projects / Posts / Demos (publishable) --------------------------------


@router.get("/projects")
def list_projects(svc: ContentService = Depends(get_content_service)):
    return svc.list_all(PROJECTS, order_by="updated_at", descending=True)


@router.post("/projects")
def create_project(body: ProjectIn, user: AdminUser = Depends(require_admin),
                   svc: ContentService = Depends(get_content_service)):
    return _create(PROJECTS, body.model_dump(), user, svc)


@router.put("/projects/{doc_id}")
def update_project(doc_id: str, body: ProjectIn, user: AdminUser = Depends(require_admin),
                   svc: ContentService = Depends(get_content_service)):
    return _update(PROJECTS, doc_id, body.model_dump(), user, svc)


@router.delete("/projects/{doc_id}")
def delete_project(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(PROJECTS, doc_id, svc)


@router.post("/projects/{doc_id}/publish")
def publish_project(doc_id: str, publish: bool = True, user: AdminUser = Depends(require_admin),
                    svc: ContentService = Depends(get_content_service)):
    updated = svc.publish(PROJECTS, doc_id, publish, user.email)
    if updated is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.get("/posts")
def list_posts(svc: ContentService = Depends(get_content_service)):
    return svc.list_all(POSTS, order_by="updated_at", descending=True)


@router.post("/posts")
def create_post(body: PostIn, user: AdminUser = Depends(require_admin),
                svc: ContentService = Depends(get_content_service)):
    return _create(POSTS, body.model_dump(), user, svc)


@router.put("/posts/{doc_id}")
def update_post(doc_id: str, body: PostIn, user: AdminUser = Depends(require_admin),
                svc: ContentService = Depends(get_content_service)):
    return _update(POSTS, doc_id, body.model_dump(), user, svc)


@router.delete("/posts/{doc_id}")
def delete_post(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(POSTS, doc_id, svc)


@router.post("/posts/{doc_id}/publish")
def publish_post(doc_id: str, publish: bool = True, user: AdminUser = Depends(require_admin),
                 svc: ContentService = Depends(get_content_service)):
    updated = svc.publish(POSTS, doc_id, publish, user.email)
    if updated is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated


@router.get("/demos")
def list_demos(svc: ContentService = Depends(get_content_service)):
    return svc.list_all(DEMOS, order_by="updated_at", descending=True)


@router.post("/demos")
def create_demo(body: DemoIn, user: AdminUser = Depends(require_admin),
                svc: ContentService = Depends(get_content_service)):
    return _create(DEMOS, body.model_dump(), user, svc)


@router.put("/demos/{doc_id}")
def update_demo(doc_id: str, body: DemoIn, user: AdminUser = Depends(require_admin),
                svc: ContentService = Depends(get_content_service)):
    return _update(DEMOS, doc_id, body.model_dump(), user, svc)


@router.delete("/demos/{doc_id}")
def delete_demo(doc_id: str, svc: ContentService = Depends(get_content_service)):
    return _delete(DEMOS, doc_id, svc)


@router.post("/demos/{doc_id}/publish")
def publish_demo(doc_id: str, publish: bool = True, user: AdminUser = Depends(require_admin),
                 svc: ContentService = Depends(get_content_service)):
    updated = svc.publish(DEMOS, doc_id, publish, user.email)
    if updated is None:
        raise HTTPException(status_code=404, detail="Demo not found")
    return updated


# ---- Media -----------------------------------------------------------------


@router.post("/media/upload-url", response_model=UploadUrlResponse)
def create_upload_url(
    body: UploadUrlRequest,
    user: AdminUser = Depends(require_admin),
    svc: ContentService = Depends(get_content_service),
    storage: StorageConnector = Depends(get_storage_connector),
    settings: Settings = Depends(get_settings),
):
    safe_name = body.filename.replace("/", "_").strip() or "file"
    path = f"media/{uuid.uuid4().hex}-{safe_name}"
    upload_url = storage.create_upload_url(path, body.content_type, settings.upload_url_ttl_seconds)
    public_url = storage.public_url(path)
    svc.create(
        MEDIA,
        {
            "gcs_path": path,
            "public_url": public_url,
            "content_type": body.content_type,
            "uploaded_by_email": user.email,
        },
        user.email,
    )
    return UploadUrlResponse(upload_url=upload_url, public_url=public_url, gcs_path=path)


@router.get("/media")
def list_media(svc: ContentService = Depends(get_content_service)):
    return svc.list_all(MEDIA, order_by="uploaded_at", descending=True)
