# Architecture

TaskFlow is built as a separated Full-Stack Monorepo.

## Overall Architecture

```text
Frontend (React + Vite)
    ↓ (HTTP REST API via Axios / TanStack Query)
Backend (Express + Node.js)
    ↓ (Mongoose ORM)
Database (MongoDB Atlas)
```

## Frontend Architecture

The frontend follows a feature-driven, component-based approach:
- **Pages**: Top-level route components (`Dashboard`, `TodoDetails`).
- **Components**: Reusable UI elements (`TodoCard`, `Button`, `Modal`).
- **Services**: Abstracted API calls using Axios. UI components do not call Axios directly.
- **State Management**: `TanStack Query` handles server state (caching, refetching, mutations). Local React state manages UI-specific state (modals, forms).
- **Validation**: `React Hook Form` and `Zod` are used to ensure data integrity before API submission.

## Backend Architecture

The backend implements a standard layered architecture to enforce separation of concerns:
- **Routes**: Define HTTP endpoints and map them to specific controllers.
- **Controllers**: Handle HTTP requests, parse inputs, and format HTTP responses.
- **Services**: Contain the core business logic. They interface with Mongoose models.
- **Models**: Define the MongoDB schema and interact directly with the database.
- **Middleware**: Global error handling, validation (`Zod`), and security (`Helmet`, `CORS`).

### Why this Architecture?
- **Scalability**: By separating the frontend and backend, they can be deployed and scaled independently.
- **Maintainability**: The layered backend structure makes unit testing easier and keeps the codebase clean. The service layer allows changing the database without affecting the controllers.
- **Performance**: TanStack Query minimizes unnecessary API calls and provides optimistic UI capabilities on the frontend.
