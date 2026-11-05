# site/Makefile — landing (Next.js static export).
SHELL := /bin/bash
COMPOSE := docker compose -f compose.dev.yaml

.PHONY: install dev build typecheck lint test ci up down logs clean

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

typecheck:
	npm run typecheck

lint: typecheck

test: build
	node scripts/smoke.mjs

ci: install typecheck test

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f site-web

clean:
	rm -rf out .next
