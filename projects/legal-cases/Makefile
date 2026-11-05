SHELL := /bin/bash
COMPOSE := docker compose -f compose.dev.yaml

.PHONY: install build test lint ci up down logs

install:
	composer install --no-interaction --prefer-dist

build:
	npm ci
	npm run build

test:
	@test -f .env || cp .env.example .env
	@php artisan key:generate --force >/dev/null
	APP_ENV=testing DB_CONNECTION=sqlite DB_DATABASE=:memory: CACHE_STORE=array QUEUE_CONNECTION=sync SESSION_DRIVER=array php artisan test

lint:
	./vendor/bin/pint --test

ci: install build test lint

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f legal-web
