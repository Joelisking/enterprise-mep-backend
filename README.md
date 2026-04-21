# Asera MEP — Backend API

RESTful API backend for the Asera MEP dashboard. Handles authentication, site/task management, HR rate tracking, and procurement data for MEP (Mechanical, Electrical, Plumbing) construction operations in Ghana.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript 5.4 |
| Runtime | Node.js 20 |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma 5.11 |
| Auth | JWT + Passport.js |
| Security | Helmet 7 |
| Validation | class-validator + class-transformer |
| API Docs | Swagger / OpenAPI 7 |
| Password Hashing | bcrypt |
| Testing | Jest 29 + Supertest |
| Package Manager | npm |

## Project Structure

```
enterprise-mep-backend/
├── src/
│   ├── main.ts                        # Bootstrap, global middleware, Swagger setup
│   ├── app.module.ts                  # Root module
│   ├── auth/                          # JWT + Passport authentication
│   │   ├── auth.controller.ts         # /auth/register, /auth/login, /auth/me
│   │   ├── auth.service.ts
│   │   ├── strategies/                # jwt.strategy.ts, local.strategy.ts
│   │   ├── guards/                    # JwtAuthGuard (global), LocalAuthGuard
│   │   └── decorators/                # @CurrentUser(), @Public()
│   ├── users/                         # User CRUD
│   ├── sites/                         # Site CRUD
│   ├── tasks/                         # Task CRUD + nested comments
│   ├── hr/                            # HR daily rates + bulk upsert
│   ├── procurement/                   # Material catalog + bulk upsert
│   ├── prisma/                        # PrismaService + PrismaModule
│   └── common/
│       ├── filters/                   # AllExceptionsFilter (global)
│       ├── interceptors/              # LoggingInterceptor, TransformInterceptor
│       └── dto/                       # PaginationDto
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── seed.ts                        # Seed script
│   └── migrations/
├── Dockerfile                         # Multi-stage production build
├── .env.example                       # Environment variable template
└── nest-cli.json
```

## API Endpoints

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new user account |
| `POST` | `/auth/login` | Public | Authenticate and receive a JWT |
| `GET` | `/auth/me` | Required | Get the current authenticated user |

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/users` | Required | List all users |
| `GET` | `/users/:id` | Required | Get user by ID |
| `POST` | `/users` | Required | Create user |
| `PATCH` | `/users/:id` | Required | Update user |
| `DELETE` | `/users/:id` | Required | Delete user |

### Sites — `/api/sites`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/sites` | Required | List all sites |
| `GET` | `/sites/:id` | Required | Get site with all tasks |
| `POST` | `/sites` | Required | Create site |
| `PATCH` | `/sites/:id` | Required | Update site |
| `DELETE` | `/sites/:id` | Required | Delete site |

### Tasks — `/api/tasks`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | Required | List tasks (filter by `siteId`, `scope`, `status`) |
| `GET` | `/tasks/:id` | Required | Get task with technicians, materials, comments |
| `POST` | `/tasks` | Required | Create task |
| `PATCH` | `/tasks/:id` | Required | Update task |
| `DELETE` | `/tasks/:id` | Required | Delete task |
| `POST` | `/tasks/:id/comments` | Required | Add comment to task |
| `DELETE` | `/tasks/:id/comments/:commentId` | Required | Remove comment |

### HR Rates — `/api/hr/rates`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/hr/rates` | Required | List all HR rates |
| `GET` | `/hr/rates/:id` | Required | Get rate by ID |
| `POST` | `/hr/rates` | Required | Create rate |
| `PATCH` | `/hr/rates/:id` | Required | Update rate |
| `DELETE` | `/hr/rates/:id` | Required | Delete rate |
| `PUT` | `/hr/rates/bulk` | Required | Bulk upsert (used by Excel upload) |

### Procurement — `/api/procurement/materials`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/procurement/materials` | Required | List all materials |
| `GET` | `/procurement/materials/:id` | Required | Get material by ID |
| `POST` | `/procurement/materials` | Required | Create material |
| `PATCH` | `/procurement/materials/:id` | Required | Update material |
| `DELETE` | `/procurement/materials/:id` | Required | Delete material |
| `PUT` | `/procurement/materials/bulk` | Required | Bulk upsert (used by Excel upload) |

### API Documentation

Interactive Swagger UI is available at `GET /docs` when the server is running.

## Database Schema

**Models:**

- **User** — email (unique), name, password (hashed), role (`ADMIN` | `MANAGER` | `VIEWER`)
- **Site** — name, location, supervisor, supervisorPhone
- **Task** — siteId (FK), scope (`Plumbing` | `Electrical` | `AC_Works`), status (`In_Progress` | `Completed` | `Halted`), progress %, technicians, materialsUsed, comments
- **Technician** — taskId (FK), name, role
- **TaskMaterial** — taskId (FK), materialId (FK), quantity
- **Comment** — taskId (FK), author, text, date
- **HrRate** — role (unique), dailyRateGHS
- **Material** — materialName, unitCostGHS, unit

Task deletion cascades to all related technicians, materials, and comments.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (or a [Neon](https://neon.tech) serverless instance)

### Installation

```bash
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Seed the database with initial data
npm run prisma:seed
```

### Development

```bash
npm run start:dev
```

Runs on [http://localhost:4000](http://localhost:4000) with watch mode.

Swagger docs: [http://localhost:4000/docs](http://localhost:4000/docs)

### Production Build

```bash
npm run build
npm run start:prod
```

### Prisma Studio

```bash
npm run prisma:studio
```

Opens a visual database browser at [http://localhost:5555](http://localhost:5555).

## Authentication

All routes are protected by `JwtAuthGuard` globally. Public routes (register, login) are decorated with `@Public()`.

**Login flow:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Returns:

```json
{
  "access_token": "<jwt>",
  "user": { "id": "...", "email": "...", "name": "...", "role": "ADMIN" }
}
```

Use the token in subsequent requests:

```http
Authorization: Bearer <access_token>
```

## Testing

```bash
# Run unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## Docker

The included `Dockerfile` uses a multi-stage build targeting Node 20 Alpine.

```bash
# Build image
docker build -t asera-mep-api .

# Run container
docker run -p 4000:4000 --env-file .env asera-mep-api
```

The production image runs as an unprivileged user (`nestjs:1001`) and exposes port `4000`.

## Global Middleware & Interceptors

| Layer | Purpose |
|---|---|
| `Helmet` | Security headers (CSP, X-Frame-Options, etc.) |
| `ValidationPipe` | Whitelist + transform + class-validator on all request bodies |
| `AllExceptionsFilter` | Consistent error response shape across all routes |
| `LoggingInterceptor` | Logs all incoming requests and outgoing responses |
| `TransformInterceptor` | Wraps all responses in a standard `{ data, statusCode }` envelope |

## Linting

```bash
npm run lint
```
