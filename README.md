# ahmadin - Multi-Vendor E-Commerce Platform

ahmadin is a comprehensive multi-vendor e-commerce platform built with Next.js, NestJS, and TypeScript. It provides a complete solution for online marketplaces where multiple vendors can sell their products to customers through a **modern**, scalable architecture.

## 🚀 Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products by category, search, and advanced filters with real-time search
- **Product Details**: Detailed product pages with image galleries, descriptions, reviews, and vendor information
- **Shopping Cart**: Add/remove items, update quantities, and manage cart with real-time updates and persistence
- **Wishlist**: Save products for later purchase with persistent storage and quick add/remove functionality
- **Order Management**: Track order history, status updates, and delivery tracking with detailed order information
- **User Profile**: Manage account information, addresses, and payment methods with profile customization
- **Reviews & Ratings**: Read and write product reviews with rating system and helpfulness voting
- **Responsive Design**: Mobile-first, responsive interface with modern UI components and smooth animations

### 🏪 Vendor/Store Features
- **Store Management**: Create and manage multiple stores with unique branding and settings
- **Store Dashboard**: Comprehensive dashboard with sales analytics, performance metrics, and revenue tracking
- **Product Management**: Add, edit, and manage product listings with bulk operations and inventory tracking
- **Order Management**: View and process customer orders with status updates and fulfillment tracking
- **Inventory Management**: Track stock levels, variants, and low stock alerts with automated notifications
- **Store Analytics**: Sales reports, performance metrics, customer insights, and revenue analytics
- **Store Settings**: Manage store information, commission rates, payout schedules, and store policies
- **Member Management**: Invite and manage store members with role-based permissions (Owner, Admin, Member)

### 🛒 E-Commerce Features
- **Multi-Vendor Support**: Multiple vendors selling on one unified platform with individual storefronts
- **Product Variants**: Support for different colors, sizes, materials, and custom attributes with SKU management
- **Inventory Tracking**: Real-time stock management with automatic updates and low stock alerts
- **Commission System**: Configurable commission rates and payout processing with detailed financial tracking
- **Payment Integration**: Multiple payment methods with secure processing and transaction history
- **Shipping Options**: Various shipping methods, rates, and tracking integration with carrier support
- **Tax Calculation**: Automatic tax calculation based on location and product type with tax reporting
- **Discount System**: Promo codes, automatic discounts, and seasonal sales with coupon management

### 🔧 Technical Features
- **Type Safety**: Full TypeScript implementation across frontend and backend with strict type checking
- **Session Management**: Secure session-based authentication with refresh tokens and automatic renewal
- **File Management**: Secure file upload and storage with metadata tracking and image optimization
- **API Documentation**: Comprehensive API documentation with OpenAPI/Swagger and interactive testing
- **Error Handling**: Robust error handling with user-friendly messages and detailed error logging
- **Performance**: Optimized for speed with caching, lazy loading, and efficient database queries
- **Security**: Session-based authentication, CORS protection, input validation, and secure password hashing

## 🛠️ Tech Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.8+
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: Zustand for client state, 
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Charts**: Recharts for analytics and dashboards
- **Authentication**: Custom auth system with session management

### Backend (NestJS)
- **Framework**: NestJS 11 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with JWT tokens and HTTP-only cookies
- **Validation**: Zod schema validation with comprehensive input sanitization
- **File Storage**: Local file system with metadata tracking and image optimization
- **CORS**: Configured for secure cross-origin requests with credential support
- **Error Handling**: Global exception filters and custom error responses with detailed logging
- **Security**: Argon2 password hashing, rate limiting, and secure session management

### Development Tools
- **Package Manager**: pnpm with workspace management
- **Build System**: Turborepo monorepo for efficient builds and caching
- **Linting**: Biome with TypeScript support
- **Formatting**: Prettier for consistent code style
- **Testing**: Jest for unit and integration tests
- **Database Migrations**: Drizzle Kit for schema management

## 📋 Requirements

### System Requirements
- **Node.js**: 22.18.0 or higher (see `.nvmrc` file)
- **pnpm**: 10.18.0 or higher (see `package.json` engines)
- **PostgreSQL**: 14.0 or higher
- **Git**: Latest version

### Version Management
This project uses strict version requirements to ensure consistency across development environments:

- **Node.js**: Use the version specified in `.nvmrc` (22.18.0)
- **pnpm**: Use the version specified in `package.json` engines (10.18.0+)
- **Package Manager**: pnpm is required (npm/yarn are not supported)

#### Quick Setup with nvm (Node Version Manager)
```bash
# Install and use the correct Node.js version
nvm install
nvm use

# Verify versions
node --version  # Should show v22.18.0
pnpm --version  # Should show 10.18.0+
```

#### Version Enforcement
This project uses `engines-strict: true` in `package.json` to enforce version requirements. This means:
- pnpm will refuse to install dependencies if Node.js or pnpm versions don't meet requirements
- CI/CD pipelines will fail if incorrect versions are used
- Developers will get clear error messages about version mismatches

### Development Infrastructure (Docker Compose)
For local development, you can use Docker Compose to run the required services:

```bash
# Start all development services (PostgreSQL, Redis, MinIO)
docker compose -f docker-compose.dep.yaml up -d

# View running services
docker compose -f docker-compose.dep.yaml ps

# View logs
docker compose -f docker-compose.dep.yaml logs -f

# Stop all services
docker compose -f docker-compose.dep.yaml down

# Stop and remove volumes (WARNING: This will delete all data)
docker compose -f docker-compose.dep.yaml down -v
```

#### Services Included
- **PostgreSQL 14**: Database server with health checks
- **Redis 7**: Caching and session storage
- **MinIO**: Object storage for file uploads
- **Network**: Isolated bridge network for service communication

### Environment Variables

#### Client (.env.local)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Server (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ahmadin

# Server Configuration
SERVER_PORT=8000
CLIENT_HOST=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🚀 Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ahmadin
```

### 2. Verify Prerequisites
```bash
# Check Node.js version (should be 22.18.0+)
node --version

# Check pnpm version (should be 10.18.0+)
pnpm --version

# If using nvm, switch to the correct Node.js version
nvm use
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb ahmadin

# Run database migrations
cd apps/server
pnpm db:migrate
```

### 5. Environment Configuration
```bash
# Copy environment files
cp apps/client/.env.example apps/client/.env.local
cp apps/server/.env.example apps/server/.env

# Edit environment variables with your configuration
```

### 6. Start Development Servers
```bash
# Start all applications (client + server)
pnpm dev:all

# Or start individually
pnpm dev --filter=client
pnpm dev --filter=server
```

### 7. Build for Production
```bash
# Build all applications
pnpm build:all

# Start production servers
pnpm start:all
```



## 📁 Project Structure

```
ahmadin/
├── apps/
│   ├── client/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/              # App Router pages and layouts
│   │   │   │   ├── (admin)/      # Admin route group
│   │   │   │   ├── (customer)/   # Customer route group
│   │   │   │   ├── (vendor)/     # Vendor route group
│   │   │   │   ├── auth/         # Authentication pages
│   │   │   │   ├── _actions/     # Server actions
│   │   │   │   ├── _features/    # Feature-specific components
│   │   │   │   └── components/   # Shared components
│   │   │   ├── components/       # Reusable UI components
│   │   │   │   ├── ui/           # Radix UI components
│   │   │   │   └── layout/       # Layout components
│   │   │   ├── contexts/         # React contexts
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities and configurations
│   │   │   ├── middleware/       # Next.js middleware
│   │   │   └── types/            # TypeScript type definitions
│   │   ├── public/               # Static assets
│   │   └── package.json
│   │
│   └── server/                   # NestJS backend application
│       ├── src/
│       │   ├── config/           # Configuration files
│       │   ├── constants/        # Application constants
│       │   ├── database/         # Database schemas and DTOs
│       │   │   ├── dtos/         # Data Transfer Objects
│       │   │   ├── schemas/      # Drizzle ORM schemas
│       │   │   └── module/       # Database module
│       │   ├── decorators/       # Custom decorators
│       │   ├── events/           # Event handlers
│       │   ├── features/         # Feature modules
│       │   │   ├── auth/         # Authentication module
│       │   │   ├── stores/       # Store management
│       │   │   └── users/        # User management
│       │   ├── filters/          # Exception filters
│       │   ├── guards/           # Authentication guards
│       │   ├── helpers/          # Utility helpers
│       │   ├── pipes/            # Validation pipes
│       │   └── utils/            # Utility functions
│       ├── drizzle/              # Database migrations
│       └── package.json
│
├── packages/
│   ├── common/                   # Shared utilities and types
│   │   ├── src/
│   │   │   ├── constants/        # Shared constants
│   │   │   ├── enums/           # Shared enums
│   │   │   ├── schemas/         # Zod validation schemas
│   │   │   ├── types/           # Shared TypeScript types
│   │   │   └── utils/           # Shared utility functions
│   │   └── package.json
│   │
│   └── config/                   # Shared configuration
│       ├── typescript/           # TypeScript configurations
│       └── package.json
│
├── turbo.json                    # Turborepo workspace configuration
├── package.json                  # Root package.json
└── pnpm-workspace.yaml          # pnpm workspace configuration
```

## 🔧 Available Scripts

### Root Level
```bash
# Development
pnpm dev:all          # Start all applications in development mode
pnpm start:all        # Start all applications in production mode
pnpm build:all        # Build all applications
pnpm build:pack       # Build packages only

# Code Quality
pnpm format           # Format code with Prettier
pnpm lint             # Lint code with Biome
```

### Client Application
```bash
cd apps/client
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run Biome
```

### Server Application
```bash
cd apps/server
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests

# Database
pnpm db:generate      # Generate new migration
pnpm db:migrate       # Run database migrations
pnpm db:drop          # Drop database schema
pnpm db:pull          # Pull schema from database
```

## 🗄️ Database Schema

The application uses PostgreSQL with Drizzle ORM. Key entities include:

- **Users**: Customer accounts with authentication
- **Stores**: Vendor store information and settings
- **Products**: Product catalog with variants and inventory
- **Orders**: Customer orders with line items
- **Files**: File metadata and storage information
- **Sessions**: User authentication sessions

## 🔐 Authentication & Security

### Authentication System
- **Session-based Authentication**: Secure session management with HTTP-only cookies
****- **Multi-Provider Support**: Email/password, Google OAuth, and GitHub OAuth integration
- **Session Validation**: Real-time session validation with automatic logout on expiration
- **Device Tracking**: Track login devices and sessions for security monitoring

### Role-Based Access Control (RBAC)
- **User Roles**: 
  - `user` - Regular customer with shopping capabilities
  - `admin` - Platform administrator with management access
  - `superAdmin` - System owner with full platform control
- **Store Member Roles**:
  - `owner` - Store owner with full store management permissions
  - `admin` - Store administrator with product and order management
  - `member` - Store member with limited access to assigned tasks
- **Invitation System**: Secure store member invitations with pending/accepted/rejected status tracking

### Security Features
- **Password Security**: Argon2 password hashing with secure salt generation
- **Input Validation**: Comprehensive Zod schema validation on all API endpoints
- **CORS Protection**: Configured for secure cross-origin requests with credential support
- **Session Security**: HTTP-only cookies with secure flags and proper expiration
- **Error Handling**: Secure error responses without sensitive information leakage
- **Rate Limiting**: API rate limiting to prevent abuse and brute force attacks
- **Email Verification**: Required email verification for account activation
- **Phone Validation**: International phone number validation and formatting

### Authentication Flow
1. **Registration**: User registration with email verification and phone validation
2. **Login**: Secure login with session creation and device tracking
3. **Session Management**: Automatic session validation and refresh token renewal
4. **Logout**: Secure session termination and cookie cleanup
5. **Password Reset**: Secure password reset flow with email verification

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run end-to-end tests
pnpm test:e2e
```

## 📦 Deployment

### Production Deployment
For production deployment, you'll need to set up the following infrastructure:

- **Database**: PostgreSQL 14+ with proper backup and monitoring
- **Caching**: Redis 7+ for session storage and caching
- **File Storage**: MinIO or AWS S3 for file uploads
- **Load Balancer**: Nginx or similar for traffic distribution
- **SSL/TLS**: HTTPS certificates for secure communication

### Environment Variables for Production
Ensure all environment variables are properly configured for your production environment, including:
- Database connection strings
- Redis connection details
- MinIO/S3 storage configuration
- File storage paths
- CORS origins
- API endpoints


### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed
- Follow the existing code style

## 🔄 Version History

- **v1.0.0**: Initial release with core e-commerce features
- Multi-vendor marketplace functionality
- Complete customer and vendor dashboards
- Modern UI with responsive design
- Secure authentication and authorization
