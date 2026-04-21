# Enterprise MEP — Backend API

**Enterprise MEP** is a site operations platform for MEP (Mechanical, Electrical, Plumbing) construction and maintenance work. It is built by **Asera**. The product name is Enterprise MEP; Asera is the company.

## Stack

- NestJS 10, TypeScript 5.4, Node.js 20, npm
- PostgreSQL (Neon serverless) via Prisma 5 ORM
- JWT + Passport.js authentication
- `@nestjs/swagger` for OpenAPI spec generation
- Docker (multi-stage, Node 20 Alpine) for production

## Module structure

```
src/
  auth/         JWT auth, login, register, guards, decorators
  users/        User CRUD
  sites/        Site CRUD
  tasks/        Task CRUD + nested comments
  hr/           HR daily rates + bulk upsert
  procurement/  Material catalog + bulk upsert
  prisma/       PrismaService (database access)
  common/       Global filters, interceptors, pagination DTO
```

Each module follows the same pattern: `module.ts` → `controller.ts` → `service.ts` → `dto/` → `entities/`.

## Response envelope

Every response is automatically wrapped by `TransformInterceptor`:

```json
{ "success": true, "data": <actual payload> }
```

**Never manually wrap return values.** Just return the data from service methods — the interceptor handles it. The frontend's axios mutator unwraps this automatically, so frontend consumers receive the payload directly.

## Auth

Routes are JWT-protected globally. To make a route public, use the `@Public()` decorator:

```ts
import { Public } from './decorators/public.decorator'

@Public()
@Post('register')
register() { ... }
```

To get the authenticated user in a controller method:

```ts
@Get('me')
me(@CurrentUser() user: User) { ... }
```

## Adding a new endpoint — required checklist

The frontend uses orval to generate typed hooks from this backend's OpenAPI spec. For codegen to produce useful types (not `unknown`), every new endpoint **must** have:

### 1. Entity class with `@ApiProperty`

Create `src/<module>/entities/<name>.entity.ts`. Mirror the Prisma model exactly. Never expose `password`. For nested relations, import and reference other entity classes.

```ts
import { ApiProperty } from '@nestjs/swagger'

export class SiteEntity {
  @ApiProperty({ example: 'accra-central' })
  id: string

  @ApiProperty({ example: 'Accra Central' })
  name: string
  // ... all fields
}
```

### 2. `@ApiResponse` decorators on the controller method

```ts
import {
  ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { SiteEntity } from './entities/site.entity'

@Get()
@ApiOkResponse({ type: [SiteEntity] })           // list
create() { ... }

@Get(':id')
@ApiOkResponse({ type: SiteEntity })              // single
@ApiNotFoundResponse({ description: '...' })
findOne() { ... }

@Post()
@ApiCreatedResponse({ type: SiteEntity })         // create
create() { ... }

@Delete(':id')
@ApiNoContentResponse({ description: '...' })     // delete (204)
@ApiNotFoundResponse({ description: '...' })
remove() { ... }
```

Document the **unwrapped** type — not `{ success, data }`. The frontend unwraps the envelope before consuming.

### 3. Run codegen in the frontend

```bash
cd enterprise-mep-frontend && pnpm codegen
```

This fetches `/docs-json`, saves `openapi.json`, and regenerates `lib/api/generated/`.

## Swagger UI

- UI: `http://localhost:4000/docs`
- JSON spec: `http://localhost:4000/docs-json`
- YAML spec: `http://localhost:4000/docs-yaml`

After adding new entities or decorators, restart the dev server and verify your new response schemas appear in Swagger (look for a populated `schema.$ref`, not an empty `{}`).

## Prisma

### Workflow for schema changes

```bash
npm run prisma:generate    # regenerate client after schema edits
npm run prisma:migrate:dev # create and apply a migration
npm run prisma:seed        # reseed the database
npm run prisma:studio      # visual DB browser at localhost:5555
```

### Enums

Prisma enums are imported from `@prisma/client` in DTOs, entities, and controllers:

```ts
import { Scope, TaskStatus, TechnicianRole, UserRole } from '@prisma/client'
```

Current enums: `Scope` (PLUMBING / ELECTRICAL / AC_WORKS), `TaskStatus` (IN_PROGRESS / COMPLETED / HALTED), `TechnicianRole`, `UserRole` (ADMIN / MANAGER / VIEWER).

### Relations and cascade deletes

Task deletion cascades to `Technician`, `TaskMaterial`, and `Comment` records (defined in `schema.prisma`). Do not manually delete these — just delete the parent task.

`sites.findOne()` includes tasks with `{ technicians, materialsUsed, comments }`. `tasks.findAll/findOne` use `TASK_INCLUDE` (defined in `tasks.service.ts`) which additionally includes `materialsUsed → material` and `site: { id, name }`.

## Global behaviour

| Layer | Behaviour |
|---|---|
| `ValidationPipe` | Whitelists all request bodies, transforms types, rejects unknown fields |
| `AllExceptionsFilter` | Shapes all errors as `{ success: false, statusCode, message, timestamp, path }` |
| `LoggingInterceptor` | Logs every request and response |
| `TransformInterceptor` | Wraps every success response in `{ success: true, data }` |
| `JwtAuthGuard` | Applied globally — use `@Public()` to opt out |

## Environment

Copy `.env.example` to `.env`:

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://...   # from console.neon.tech
JWT_SECRET=...                   # long random string
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
```

## Running locally

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run start:dev    # http://localhost:4000
```

## Conventions

**No comments explaining what code does.** Name things clearly. Comments only for non-obvious constraints or workarounds.

**Services own business logic.** Controllers are thin — validate input, call service, return result.

**Use `@ApiOperation({ summary })` on every endpoint** — it becomes the generated hook name in the frontend via orval.

**Never throw raw errors.** Use NestJS exceptions: `NotFoundException`, `ConflictException`, `BadRequestException`, etc. They are caught by `AllExceptionsFilter` and shaped correctly.
