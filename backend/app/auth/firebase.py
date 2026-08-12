"""Admin authentication.

Every `/api/admin/*` route depends on `require_admin`, which:

1. Extracts the bearer token from the Authorization header.
2. Verifies it (real Firebase ID token in production, or a dev token locally).
3. Confirms the resolved email is on the configured allowlist.

In `mock` auth mode a bearer token of the form `dev:<email>` is accepted so the
CMS and its tests can run without contacting Firebase.
"""

from dataclasses import dataclass
from typing import Optional

from fastapi import Depends, Header, HTTPException, status

from ..config import Settings, get_settings

_firebase_ready = False


@dataclass
class AdminUser:
    email: str
    uid: str


def _init_firebase() -> None:
    global _firebase_ready
    if _firebase_ready:
        return
    import firebase_admin
    from firebase_admin import credentials

    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.ApplicationDefault())
    _firebase_ready = True


def _verify_firebase_token(token: str) -> AdminUser:
    _init_firebase()
    from firebase_admin import auth as firebase_auth

    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception as exc:  # noqa: BLE001 - surface any verification failure as 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        ) from exc
    email = (decoded.get("email") or "").lower()
    return AdminUser(email=email, uid=decoded.get("uid", ""))


def _verify_mock_token(token: str) -> AdminUser:
    if not token.startswith("dev:"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
    email = token[len("dev:"):].strip().lower()
    return AdminUser(email=email, uid=f"dev-{email}")


def require_admin(
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> AdminUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    token = authorization.split(" ", 1)[1].strip()

    if settings.auth_mode == "firebase":
        user = _verify_firebase_token(token)
    else:
        user = _verify_mock_token(token)

    if user.email not in settings.allowed_emails:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not authorized for admin access",
        )
    return user
