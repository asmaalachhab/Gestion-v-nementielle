# Event Management Platform (EventMa)

Plateforme de gestion d'évènements + réservations (Maroc) avec **Spring Boot (API REST)** + **React (UI)** + **MySQL**.

## Lancer le projet (Docker)

Pré-requis: Docker + Docker Compose.

```bash
cd eventma
docker-compose up --build
```

- Frontend: http://localhost:3000
- Swagger UI: http://localhost:8080/swagger
- API Docs: http://localhost:8080/v3/api-docs

## Comptes de test

Mot de passe pour tous: `password`

- Admin: `admin@example.ma`
- Organisateur: `org@example.ma`
- Client: `client@example.ma`

## Règles métier

- **ORGANISATEUR**: créé uniquement par l'**admin**.
- Réservation:
  - si places dispo -> **CONFIRMEE** (auto-confirmation)
  - sinon -> erreur
- Annulation:
  - possible même si **CONFIRMEE** mais **uniquement** si l'évènement est à plus de **24h**.
- Image évènement: simple **URL** (`image_url`).

## Structure

```
eventma/
  backend/   (Spring Boot)
  frontend/  (React + Vite)
  db/        (schema.sql)
  docker-compose.yml
```

