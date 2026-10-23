# Migara Portfolio

Full-stack portfolio starter with a React frontend, FastAPI backend, PostgreSQL, Docker Compose, and GitHub Actions.

## What is included

- Public portfolio pages for projects, cloud work, experience, and contact
- Protected admin login and dashboard
- Project CRUD backed by PostgreSQL
- Seeded demo content for a fast first run
- Dockerized local development
- CI workflow for backend tests, frontend lint/build, and Docker builds
- CD workflow for Vercel frontend/backend deployments and Supabase migrations

## Run locally

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Admin: http://localhost:5173/admin/login

The default development credentials are `admin@example.com` / `change-me-now`. Change them in `.env` before using the project outside local development.

## Project layout

```text
frontend/       React + Vite app
backend/        FastAPI app and database models
.github/        CI and deployment workflows
docker-compose.yml
supabase/       Supabase migrations and project config
frontend/vercel.json
backend/vercel.json
```

## Deployment model

This repository is deployed as two Vercel projects backed by one Supabase project:

1. Create a Vercel project with Root Directory `frontend`.
2. Create a second Vercel project with Root Directory `backend`.
3. Create a Supabase project and use its PostgreSQL connection string for the backend.
4. Configure the GitHub secrets listed below.
5. Push to `main`. CI runs first; the deploy workflow then applies Supabase migrations and deploys both Vercel projects.

The backend is detected as a FastAPI app through `backend/app/main.py` and `backend/pyproject.toml`. The database schema is tracked in `supabase/migrations/` and deployed with `supabase db push`.

### GitHub Actions secrets

For `.github/workflows/deploy.yml`:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_FRONTEND_PROJECT_ID`
- `VERCEL_BACKEND_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_REF`

Add this repository variable:

- `VITE_API_URL` — the production backend URL ending in `/api`, for example `https://portfolio-api.vercel.app/api`

The Vercel projects and Supabase project must already exist. The workflow only deploys code and migrations; it does not create cloud accounts or projects.

### Production environment variables

Backend:

```text
DATABASE_URL=postgresql+psycopg://postgres:<password>@<supabase-host>:5432/postgres
SECRET_KEY
ADMIN_EMAIL
ADMIN_PASSWORD
CORS_ORIGINS=https://your-frontend.vercel.app
COOKIE_SAMESITE=none
COOKIE_SECURE=true
```

Frontend:

```text
VITE_API_URL=https://your-backend.vercel.app/api
```

For the frontend Vercel project, set `VITE_API_URL` in the Vercel project environment as well as the GitHub repository variable. For the backend Vercel project, set all backend variables in the Vercel project settings.

## Supabase migrations

Schema changes must be committed as SQL migration files. The deployment workflow applies pending migrations with the Supabase CLI. Do not change the production schema directly in the Supabase dashboard after migrations are enabled.

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## Useful commands

```bash
make up       # start the full stack
make down     # stop containers
make test     # backend tests + frontend production build
make lint     # Ruff + ESLint
make build    # build Docker images
```

# portfolio
