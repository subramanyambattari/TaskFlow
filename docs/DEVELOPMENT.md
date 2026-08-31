# Development Guide

## Prerequisites
- **Node.js**: v18 or higher recommended.
- **Bun**: v1.0 or higher.
- **MongoDB**: Access to a MongoDB Atlas cluster, or a local MongoDB instance.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/subramanyambattari/TaskFlow.git
   cd TaskFlow
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   bun install
   ```

3. **Backend Setup**:
   ```bash
   cd server
   bun install
   ```

## Environment Configuration

1. Copy the example `.env` file to `.env` in the root (or `server` folder):
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your actual `MONGODB_URI` and desired configurations.

## Running Locally

### Backend (Server)
```bash
cd server
bun run dev
```

### Frontend (Client)
```bash
cd client
bun run dev
```

The application will be accessible at `http://localhost:5173` and the API at `http://localhost:5000/api`.

## Testing
Tests can be executed via:
```bash
# In server
bun run test

# In client
bun run test
```

## Production Build
```bash
# Frontend
cd client
bun run build

# Backend
cd server
bun run build
```
