# SetuGov — Unified Government Interoperability Platform

SetuGov is a polished college mini-project for SIH problem statement **SIH26129**: fragmented government service delivery. It demonstrates how one citizen-facing portal can connect to simulated department APIs through a centralized interoperability layer.

> All department data and demo identities are fictional. The connectors in `backend/src/connectors` are mock APIs and do not connect to real government systems.

## What is included

- React + Bootstrap responsive citizen, officer and administrator workspaces.
- Express REST API with Mongoose models, JWT authentication and bcrypt password hashing.
- Four mock department connectors: Citizen Registry, Revenue & Land Records, Social Welfare, and Municipal Services.
- Common response normalization in `backend/src/services/interoperabilityService.js`.
- Consent grant/revoke with backend enforcement before protected application submission.
- Application reference IDs, status tracking, officer updates and notifications.
- Admin statistics sourced from MongoDB when MongoDB is enabled.
- MongoDB seed data: 10 fictional citizens, 4 departments, 4 services, sample applications and consent records.
- Importable Postman collection in `postman/SetuGov.postman_collection.json`.

## Architecture

```text
React client → Express REST API → JWT / role middleware
                              → Mongoose → MongoDB
                              → interoperability service
                                  → Citizen Registry mock
                                  → Land Records mock
                                  → Social Welfare mock
                                  → Municipal Services mock
```

## Run locally

Prerequisites: Node.js 18+ and MongoDB 6+ (local or Atlas).

```powershell
Copy-Item backend/.env.example backend/.env
# Edit backend/.env if your MongoDB URL or JWT secret differs.
npm run install:all
npm run seed
```

Start two terminals:

```powershell
npm run dev:api
npm run dev:web
```

Open `http://localhost:5173`.

If MongoDB is not available, the API automatically starts with a fictional in-memory demo dataset when `ALLOW_MEMORY_FALLBACK=true`. This is useful for a UI walkthrough; use MongoDB plus `npm run seed` for persistent data and the full database demonstration.

## Demo credentials

All demo passwords are `Demo@123`.

| Role | Email |
| --- | --- |
| Citizen | `citizen@setugov.demo` |
| Department officer | `officer@setugov.demo` |
| Administrator | `admin@setugov.demo` |

## Demonstration flow

1. Sign in as the citizen and open **Data consent**.
2. Grant Social Welfare permission, then open **Available services**.
3. Submit **Welfare Scheme Application** and note the generated reference ID.
4. Sign out and sign in as the officer. Open **Assigned applications** and choose `Approved`.
5. Sign out and return as the citizen to see the updated status and notification.
6. Sign in as admin to view database-backed totals and department health.

## API overview

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Services | `GET /api/services` |
| Applications | `GET/POST /api/applications`, `PATCH /api/applications/:id/status` |
| Consent | `GET /api/consents`, `PUT/DELETE /api/consents/:departmentCode` |
| Departments | `GET /api/departments` |
| Interoperability | `POST /api/interoperability/call` |
| Admin | `GET /api/dashboard/admin` |

Import the Postman collection to test the endpoints with the `baseUrl` and `token` variables.

## Security and publishing

`.env` files, credentials, logs and build output are ignored by Git. Before publishing to a public GitHub repository, set a strong `JWT_SECRET`, inspect `git status`, and confirm no `.env` file is staged.
