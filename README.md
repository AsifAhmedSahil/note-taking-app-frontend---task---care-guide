# Secure Note-Taking App — Frontend

Frontend for a secure note-taking application built with Next.js. The application provides authenticated note management, search, pagination, and an admin interface for managing users and viewing notes and interests.

## Features

* User registration and login
* JWT-based authentication
* Protected routes
* Create, view, edit, and delete personal notes
* Server-side pagination
* Note search
* Responsive dashboard
* Account/settings page
* Admin user management
* Admin notes overview
* Admin interest groups
* Responsive mobile sidebar
* Loading, empty, error, and access-denied states
* Accessible confirmation dialogs and keyboard interactions
* Custom 404 page

## Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Next.js App Router

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment if required by the frontend configuration.

The frontend expects the backend API to be available through the configured Next.js rewrite/proxy.

## Run

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

The development server runs on the configured frontend port.

## Application Routes

### Public

| Route       | Description           |
| ----------- | --------------------- |
| `/login`    | User login            |
| `/register` | New user registration |

### Authenticated

| Route        | Description                     |
| ------------ | ------------------------------- |
| `/`          | User's notes dashboard          |
| `/notes/new` | Create a new note               |
| `/notes/:id` | View, edit, or delete a note    |
| `/settings`  | Account and session information |

### Admin

Admin routes are available only to authenticated users with the `admin` role.

| Route              | Description                     |
| ------------------ | ------------------------------- |
| `/admin/users`     | Manage users                    |
| `/admin/notes`     | View all notes                  |
| `/admin/interests` | View users grouped by interests |

Frontend role checks are used for navigation and UI visibility, while authorization is enforced by the backend.

## Backend API

The frontend communicates with the backend through the existing Next.js API rewrite.

Examples:

```text
GET  /api/notes?page=1&limit=10
GET  /api/notes?page=1&limit=10&search=meeting
POST /api/notes
PATCH /api/notes/:id
DELETE /api/notes/:id
```

Admin requests include the authenticated user's JWT:

```text
Authorization: Bearer <token>
```

The frontend does not send a note owner ID when creating or modifying notes. Ownership is determined by the backend from the authenticated JWT.

## Pagination

The dashboard and admin lists use server-driven pagination.

Supported query parameters:

```text
?page=1&limit=10
```

The backend returns pagination metadata including:

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```

The frontend uses this metadata to control navigation.

## Search

Users can search their own notes from the dashboard.

Example:

```text
/api/notes?page=1&limit=10&search=meeting
```

Search is handled by the backend and applies to note titles and content. The frontend does not fetch the entire note collection and filter it locally.

## Authentication

Authentication is handled through the existing auth layer.

The frontend:

* stores and retrieves the authenticated session through the existing auth implementation
* sends JWTs with protected API requests
* redirects unauthenticated users to `/login`
* redirects authenticated users away from `/login` and `/register`
* logs the user out when protected API requests return `401`

The frontend does not implement its own separate authentication or token system.

## Admin Access

Admin navigation is shown only when the authenticated user's role is `admin`.

Available admin sections:

* Users
* Notes
* Interests

Frontend role checks only control the user interface. The backend remains responsible for enforcing admin authorization.

## Demo Credentials

| Role  | Email                | Password    |
| ----- | -------------------- | ----------- |
| User  | `asif.test@example.com` | `Test@12345` |
| Admin | `admin2@example.com` | `Admin@12345` |

## UI

The application uses a minimal light theme designed around:

* off-white page backgrounds
* white surfaces
* charcoal text
* muted secondary text
* indigo primary actions
* subtle borders
* small shadows
* responsive layouts

The interface is designed to work across desktop, tablet, and mobile screens.

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   │   ├── users/
│   │   ├── notes/
│   │   └── interests/
│   ├── login/
│   ├── register/
│   ├── notes/
│   │   ├── new/
│   │   └── [id]/
│   ├── settings/
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── app/
│   ├── notes/
│   ├── settings/
│   └── ui/
│
└── lib/
    ├── api.ts
    └── auth.ts
```

## Validation

Before committing changes:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three checks should pass before deployment.

## Deployment

The frontend can be deployed to a Next.js-compatible hosting platform such as Vercel or another Node.js hosting environment.

Make sure the backend API URL/rewrite configuration is correctly configured for the deployment environment.

Do not commit `.env` files or authentication secrets.

## Notes

This frontend is part of the Secure Note-Taking App technical assessment. The backend and frontend are maintained as separate projects/repos, with the frontend consuming the backend REST API.
