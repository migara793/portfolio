from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=180)
    summary: str = Field(min_length=10, max_length=280)
    description: str = Field(min_length=20)
    technologies: list[str] = Field(default_factory=list)
    cloud_services: list[str] = Field(default_factory=list)
    architecture: str | None = None
    image_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    live_url: HttpUrl | None = None
    accent: str = "lime"
    featured: bool = False
    published: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

