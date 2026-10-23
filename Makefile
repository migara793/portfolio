.PHONY: up down logs test lint build

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

test:
	docker compose run --rm backend pytest
	cd frontend && npm install && npm run build

lint:
	docker compose run --rm backend ruff check .
	cd frontend && npm install && npm run lint

build:
	docker compose build

