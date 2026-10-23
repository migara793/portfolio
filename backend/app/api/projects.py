from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.models import Project, User
from app.schemas.projects import ProjectCreate, ProjectResponse

public_router = APIRouter(prefix="/projects", tags=["projects"])
admin_router = APIRouter(prefix="/admin/projects", tags=["admin-projects"])


@public_router.get("", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    return (
        db.query(Project)
        .filter(Project.published.is_(True))
        .order_by(Project.featured.desc(), Project.created_at.desc())
        .all()
    )


@public_router.get("/{slug}", response_model=ProjectResponse)
def get_project(slug: str, db: Session = Depends(get_db)) -> Project:
    project = db.query(Project).filter(Project.slug == slug, Project.published.is_(True)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@admin_router.get("", response_model=list[ProjectResponse])
def admin_list_projects(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
) -> list[Project]:
    return db.query(Project).order_by(Project.created_at.desc()).all()


@admin_router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Project:
    if db.query(Project).filter(Project.slug == payload.slug).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
    project = Project(**payload.model_dump(mode="json"))
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@admin_router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    duplicate = db.query(Project).filter(Project.slug == payload.slug, Project.id != project_id).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
    for key, value in payload.model_dump(mode="json").items():
        setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


@admin_router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()

