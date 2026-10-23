from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.models import Base, Project, User


DEMO_PROJECTS = [
    {
        "title": "Signal Ingestion Lab",
        "slug": "signal-ingestion-lab",
        "summary": "A resilient event pipeline that turns noisy cloud telemetry into useful signals.",
        "description": "A portfolio demo for exploring ingestion, validation, queue-backed processing, and searchable operational data. The focus is on clear boundaries between services and predictable failure handling.",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "cloud_services": ["Object storage", "Managed queues", "Serverless jobs"],
        "architecture": "Producers → API gateway → queue → workers → PostgreSQL / object storage",
        "accent": "lime",
        "featured": True,
        "published": True,
    },
    {
        "title": "Blue-Green Deploy Lab",
        "slug": "blue-green-deploy-lab",
        "summary": "A small deployment playground for rehearsing safe releases with fast rollback paths.",
        "description": "A deliberately small environment that makes the delivery loop visible: build an image, run checks, promote a release, and keep a rollback path available when a health check fails.",
        "technologies": ["GitHub Actions", "Docker", "Linux", "Nginx"],
        "cloud_services": ["Container registry", "CDN", "Deployment hooks"],
        "architecture": "Git push → CI → image registry → staging → health check → production",
        "accent": "blue",
        "featured": True,
        "published": True,
    },
    {
        "title": "Observability Field Notes",
        "slug": "observability-field-notes",
        "summary": "A visual notebook for making application health understandable at a glance.",
        "description": "A concept project for connecting logs, latency, errors, and deployment events into a calmer operational workflow. It is intentionally opinionated about signal quality over dashboard noise.",
        "technologies": ["React", "TypeScript", "REST APIs", "Metrics"],
        "cloud_services": ["Log aggregation", "Metrics", "Alerting"],
        "architecture": "Services → structured logs / metrics → aggregation → dashboards → alerts",
        "accent": "coral",
        "featured": False,
        "published": True,
    },
]


def initialize_database(engine) -> None:
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        settings = get_settings()
        admin = db.query(User).filter(User.email == settings.admin_email).first()
        if not admin:
            db.add(
                User(
                    email=settings.admin_email,
                    password_hash=hash_password(settings.admin_password),
                )
            )
        if db.query(Project).count() == 0:
            db.add_all(Project(**project) for project in DEMO_PROJECTS)
        db.commit()

