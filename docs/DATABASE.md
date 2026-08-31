# Database

TaskFlow uses **MongoDB Atlas**, a cloud-hosted NoSQL database, interfaced via **Mongoose**.

## Why MongoDB?
- **Flexibility**: Schema flexibility allows easy iteration if fields like tags or categories are added later.
- **Scalability**: Atlas provides seamless scaling and high availability.
- **Document Model**: The JSON-like documents map perfectly to our JavaScript/TypeScript objects.

## Schema (Todo Collection)

```typescript
{
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'], default: 'TODO' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  dueDate: { type: Date },
  createdAt: { type: Date }, // Auto-managed by Mongoose
  updatedAt: { type: Date }  // Auto-managed by Mongoose
}
```

## Indexing Strategy

To support the expected query patterns (searching, filtering, and sorting on the dashboard), the following indexes are recommended/applied:

1. **`status`**: Indexing `status` allows fast filtering by "Todo", "In Progress", etc.
2. **`priority`**: Indexing `priority` supports filtering and sorting by task importance.
3. **`dueDate`**: Supports sorting by approaching deadlines.
4. **`createdAt`**: Supports default descending sort (newest first).
5. **Text Index on `title` and `description`**: Allows efficient server-side text search (if implemented in DB, though for small lists regex or client-side filtering suffices).

## Validation
Data integrity is enforced at the schema level using Mongoose's built-in validation rules and Enums, and at the route level using Zod.
