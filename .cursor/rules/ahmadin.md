# ahmadin Content marketing and personal portfolio Platform Cursor Rules

## Project Overview
This is a monorepo containing content marketing and personal portfolio platform built with:
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Radix UI
- **Backend**: NestJS 11 with TypeScript, PostgreSQL, Prisma ORM
- **Shared**: Common package with schemas, types, and utilities
- **Package Manager**: pnpm with Turborepo for monorepo management

## Architecture Patterns

### Monorepo Structure
- Use `apps/` for applications (client, server)
- Use `packages/` for shared libraries (common, prisma)
- Follow workspace naming: `@repo/client`, `@repo/server`, `@repo/common`, `@repo/prisma`
- Use Turborepo for build orchestration and caching

### Database & ORM
- **Use Prisma ORM** for database operations
- **Direct database injection**: Use `@Inject(PRISMA_CLIENT) private readonly db: PrismaClient` in services
- Avoid DatabaseService wrapper - inject Prisma client directly
- Place database schemas in `packages/prisma/schema.prisma`
- Use Prisma CLI for migrations and schema management

### Backend (NestJS) Patterns

#### Module Structure
- Organize features in `src/features/[feature-name]/`
- Each feature should have: `[feature].module.ts`, `[feature].service.ts`, `[feature].controller.ts`
- Use dependency injection with `@Injectable()` decorators
- Import shared modules in `app.module.ts`

#### Database Connection
```typescript
// Preferred pattern for database injection
@Injectable()
export class SomeService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly db: PrismaClient
  ) {}
}
```

#### Validation & Pipes
- Use Zod schemas from `@repo/common` package
- Create custom pipes: `BodyPipe(schema)` and `QueryPipe(schema)`
- Validate all inputs with Zod schemas
- Use `formatZodError` utility for error formatting

#### Authentication & Authorization
- Use session-based authentication with HTTP-only cookies
- Implement role-based access control (RBAC)
- Use guards: `@UseGuards(UserAuthGuard)`
- Extract user context with decorators: `@CurrentUser()`, `@CurrentSession()`

#### Error Handling
- Use global `HttpExceptionFilter` for consistent error responses
- Implement proper error logging with NestJS Logger
- Return structured error responses without sensitive information

#### File Management
- Use storage providers (DiskStorageProvider, MinIOStorageProvider)
- Implement file metadata tracking
- Support multiple file types with validation
- Use `@UseInterceptors(FileInterceptor())` for file uploads

### Frontend (Next.js) Patterns

#### App Router Structure
- Use App Router with route groups: `(customer)`, `[slug]`, `superadmin`
- Organize by feature: `_features/`, `_actions/`, `_layout/`
- Use server components by default, client components with `'use client'`

#### Component Organization
- Place UI components in `components/ui/` (Radix UI based)
- Feature-specific components in `app/_features/`
- Shared components in `components/`
- Use TypeScript for all components

#### State Management
- Use Zustand for client state management
- Use React Query (`@tanstack/react-query`) for server state
- Implement custom hooks in `hooks/` directory
- Use React Hook Form with Zod validation

#### Styling
- Use Tailwind CSS 4 for styling
- Follow mobile-first responsive design
- Use Radix UI primitives with custom styling
- Implement dark mode with `next-themes`

#### Forms & Validation
- Use React Hook Form with Zod resolvers
- Implement proper form validation with error handling
- Use controlled components with proper TypeScript types
- Handle form submission with server actions

### Shared Package Patterns

#### Schema Definition
- Define Zod schemas in `packages/common/src/schemas/`
- Export types with `z.infer<typeof Schema>`
- Use consistent naming: zod schema:`Z[EntityName]`, type: `T[EntityName]`, enum: `E[EntityName]`, interface: `I[EntityName]`
- Group related schemas in subdirectories

#### Type Safety
- Export all types from `packages/common/src/index.ts`
- Use strict TypeScript configuration
- Implement proper type guards and validation
- Use Zod for runtime type checking

#### Utilities
- Place utility functions in `packages/common/src/utils/`
- Implement reusable formatters, validators, and helpers
- Use proper error handling and logging
- Export utilities from main index file

## Code Style & Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper generic constraints
- Implement proper error handling with typed errors

### Naming Conventions
- Use PascalCase for components, classes, interfaces
- Use camelCase for functions, variables, properties
- Use kebab-case for file names and directories
- Use SCREAMING_SNAKE_CASE for constants and enums

### Import/Export
- Use named exports for utilities and types
- Use default exports for React components
- Group imports: external libraries, internal modules, relative imports
- Use absolute imports with `@/` alias for client app

### Error Handling
- Implement proper error boundaries in React
- Use structured error responses in API
- Log errors appropriately with context
- Provide user-friendly error messages

## Development Guidelines

### Environment Setup
- Use Docker Compose for development dependencies (PostgreSQL, Redis, MinIO)
- Configure environment variables properly
- Use `.env.local` for client, `.env` for server
- Implement proper CORS configuration

### Testing
- Write unit tests for services and utilities
- Implement integration tests for API endpoints
- Use Jest for testing framework
- Test error scenarios and edge cases

### Performance
- Use React.memo for expensive components
- Implement proper caching strategies
- Use lazy loading for routes and components
- Optimize database queries with proper indexing

### Security
- Validate all inputs with Zod schemas
- Use Argon2 for password hashing
- Implement proper session management
- Use HTTP-only cookies for authentication
- Sanitize user inputs and file uploads

## File Organization

### Backend Structure
```
apps/server/src/
├── config/           # Environment validation
├── constants/        # Application constants
├── database/         # Database schemas and modules
├── decorators/       # Custom decorators
├── events/          # Event handlers
├── features/        # Feature modules
├── filters/         # Exception filters
├── guards/          # Authentication guards
├── helpers/         # Utility helpers
├── pipes/           # Validation pipes
├── providers/       # Storage providers
└── utils/           # Utility functions
```

### Frontend Structure
```
apps/client/src/
├── app/             # App Router pages
│   ├── (customer)/  # Customer routes
│   ├── admin/     # Admin routes
│   ├── _actions/    # Server actions
│   ├── _features/    # Feature components
│   └── _layout/     # Layout components
├── components/      # Reusable components
│   ├── ui/          # Radix UI components
│   └── layout/      # Layout components
├── hooks/           # Custom hooks
├── lib/             # Utilities and config
└── middleware/      # Next.js middleware
```

### Common Package Structure
```
packages/common/src/
├── constants/       # Shared constants
├── schemas/         # Zod validation schemas
├── types/           # TypeScript types
└── utils/           # Shared utilities
```

## Best Practices

### Database Operations
- Use transactions for multi-table operations
- Implement proper error handling for database operations
- Use prepared statements for security
- Implement proper indexing for performance

### API Design
- Use RESTful API conventions
- Implement proper HTTP status codes
- Use consistent response formats
- Implement proper pagination for list endpoints

### Component Design
- Use composition over inheritance
- Implement proper prop interfaces
- Use React.memo for performance optimization
- Implement proper error boundaries
- don't fetch data on client component, insate create separate client component for interactive feature and use server component by defoulat

### State Management
- Keep state as local as possible
- Use proper state normalization
- Implement optimistic updates where appropriate
- Use proper loading and error states

## Docker & Deployment

### Development
- Use `docker-compose.dep.yaml` for development dependencies
- Configure proper networking between services
- Use health checks for service dependencies
- Implement proper volume mounting for development

### Production
- Use multi-stage Docker builds
- Implement proper security scanning
- Use proper environment variable management
- Implement proper logging and monitoring

## Common Patterns

### API Endpoints
```typescript
@Controller('feature')
@UseGuards(UserAuthGuard)
export class FeatureController {
  @Post()
  @UsePipes(new BodyPipe(ZCreateSchema))
  async create(@Body() data: TCreate, @CurrentUser() user: TUserBasic) {
    // Implementation
  }
}
```

### React Components
```typescript
interface ComponentProps {
  // Props interface
}

export default function Component({ ...props }: ComponentProps) {
  // Component implementation
}
```

### Database Services
```typescript
@Injectable()
export class FeatureService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly db: PrismaClient
  ) {}

  async create(data: TCreate): Promise<TFeature> {
    // Database operation using Prisma client
    return await this.db.feature.create({ data });
  }
}
```

### Validation Schemas
```typescript
export const ZFeature = z.object({
  // Schema definition
});

export type TFeature = z.infer<typeof ZFeature>;
```

## Memory References
- Use Prisma ORM for database operations
- Inject Prisma client directly using `@Inject(PRISMA_CLIENT) private readonly db: PrismaClient`
- Use `docker-compose.dep.yaml` for development requirements only
- Place development setup instructions in Requirements section of README.md
