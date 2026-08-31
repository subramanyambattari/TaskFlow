# API Documentation

## Base URL
`/api`

---

## 1. Get all Todos

**Endpoint**: `GET /todos`  
**Purpose**: Retrieve a list of all Todos, with optional filtering, searching, and sorting.

**Query Parameters** (Optional):
- `search` (string): Search by title or description.
- `status` (string): Filter by status (`TODO`, `IN_PROGRESS`, `COMPLETED`).
- `priority` (string): Filter by priority (`LOW`, `MEDIUM`, `HIGH`).
- `sortBy` (string): Sort field (e.g., `createdAt`, `dueDate`, `priority`).
- `sortOrder` (string): Sort order (`asc` or `desc`).

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "123",
      "title": "Learn MongoDB",
      "description": "Understand indexing",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-09-10T00:00:00.000Z",
      "createdAt": "2026-08-31T00:00:00.000Z",
      "updatedAt": "2026-08-31T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Get one Todo

**Endpoint**: `GET /todos/:id`  
**Purpose**: Retrieve details of a specific Todo.

**Parameters**:
- `id` (string): The MongoDB `_id` of the Todo.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "123",
    "title": "Learn MongoDB",
    ...
  }
}
```

**Errors**:
- `404 Not Found`: If the Todo does not exist.
- `400 Bad Request`: If the ID format is invalid.

---

## 3. Create Todo

**Endpoint**: `POST /todos`  
**Purpose**: Create a new Todo.

**Request Body**:
```json
{
  "title": "Learn MongoDB",
  "description": "Understand indexing",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-09-10T00:00:00.000Z"
}
```

**Response** (201 Created): Returns the created Todo.

**Errors**:
- `400 Bad Request`: Validation failure (e.g., missing title).

---

## 4. Update Todo

**Endpoint**: `PUT /todos/:id`  
**Purpose**: Update an existing Todo completely.

**Request Body**: Same fields as Create Todo. All are optional, but typically sent in full.

**Response** (200 OK): Returns the updated Todo.

**Errors**:
- `404 Not Found`: If the Todo does not exist.
- `400 Bad Request`: Validation failure.

---

## 5. Delete Todo

**Endpoint**: `DELETE /todos/:id`  
**Purpose**: Delete a Todo.

**Response** (204 No Content): Empty body on success.

**Errors**:
- `404 Not Found`: If the Todo does not exist.
