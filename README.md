# ahmadin - Ustaz Ahmedin Jebel Portfolio & Digital Platform

**Ustaz Ahmedin Jebel** (አሕመዲን ጀበል) - Preacher · Historian · Community Advocate

ahmadin is a comprehensive digital platform built with Next.js, NestJS, and TypeScript, serving as both a portfolio website for Ustaz Ahmedin Jebel and an e-commerce platform for books, articles, and blogs. The platform promotes faith, heritage, and justice for Ethiopian Muslims while providing modern, scalable architecture for content management and digital commerce.

## 👤 About Ustaz Ahmedin Jebel

Ustaz Ahmedin Jebel is a prominent Ethiopian Islamic educator, historian, author, and community advocate. He has served as **Social Affairs Advisor** to the Ethiopian Islamic Affairs Supreme Council (EIASC) and is known for his work in:

- **Religious Education & Dawah**: Providing Islamic education and community guidance
- **Historical Research**: Authoring books on Ethiopian Muslim history and their relationship with political powers
- **Community Rights & Advocacy**: Speaking for equality, equal citizenship, and community rights
- **Youth Engagement**: Mobilizing and engaging younger generations in community development

### Key Milestones

- **2011**: Published "*ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ*" (Ethiopian Muslims: History of Persecution and Struggle from 615-1700)
- **2012**: Selected as one of 17 leaders for the Muslim Arbitration Committee (MAC)
- **2012-2018**: Arrested and imprisoned (2012), sentenced to 22 years (2015), released (2018)
- **2021**: Political candidacy for House of People's Representatives (Jimma city), later withdrew
- **2023**: Continued advocacy work, including speeches addressing mosque demolitions and community grievances

> *"Muslims refuse anything less than equality and will not accept being second class citizens."* - Ustaz Ahmedin Jebel

## 🚀 Features

### 📚 Portfolio & Content Features
- **Biography Section**: Comprehensive biography with timeline of key life events, roles, and achievements
- **Publications**: Showcase of books and written works with detailed information and purchase options
  - "*ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ*" (2011, 272 pages)
  - Additional books on Ethiopian Muslim history and contemporary issues
- **Media Gallery**: Integrated YouTube videos, lectures, interviews, and audio content
- **Advocacy & Impact**: Showcase of community work, speeches, and advocacy efforts
- **Articles & Blogs**: Content management system for publishing articles and blog posts
- **Multilingual Support**: Full support for English, Amharic (አማርኛ), and Oromo languages
- **Social Media Integration**: Links to YouTube channel, Facebook, Instagram, and other platforms

### 🛍️ E-Commerce Features
- **Book Store**: Browse and purchase books by category, search, and advanced filters
- **Article Marketplace**: Access premium articles with flexible pricing options
- **Blog Content**: Subscribe to blog content with comment systems
- **Product Details**: Detailed pages with descriptions, reviews, and related content
- **Order Management**: Complete order tracking, status updates, and delivery management
- **Payment Processing**: Multiple payment methods including bank transfer and online payments
- **Shopping Experience**: Buy now functionality, order history, and user accounts
- **Reviews & Ratings**: Community-driven reviews and ratings for books and content

### 🏪 Admin & Management Features
- **Content Management**: Admin panel for managing books, articles, blogs, and categories
- **Publication Management**: Add, edit, and manage book listings with inventory tracking
- **Article & Blog Editor**: Rich content editor for creating and publishing articles/blogs
- **Category Management**: Organize content with hierarchical categories and tags
- **Order Processing**: View and process customer orders with status updates
- **User Management**: Manage user accounts, roles, and permissions
- **Analytics Dashboard**: Comprehensive analytics for sales, content views, and user engagement
- **Media Library**: File management system for images, videos, and documents

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
- **Database**: PostgreSQL with Prisma ORM (Note: README mentions Drizzle, but schema uses Prisma)
- **Authentication**: Session-based authentication with JWT tokens and HTTP-only cookies
- **Validation**: Zod schema validation with comprehensive input sanitization
- **File Storage**: MinIO integration for object storage with metadata tracking and image optimization
- **CORS**: Configured for secure cross-origin requests with credential support
- **Error Handling**: Global exception filters and custom error responses with detailed logging
- **Security**: Argon2 password hashing, rate limiting, and secure session management

### Development Tools
- **Package Manager**: pnpm with workspace management
- **Build System**: Turborepo monorepo for efficient builds and caching
- **Linting**: Biome with TypeScript support
- **Formatting**: Prettier for consistent code style
- **Testing**: Jest for unit and integration tests
- **Database Migrations**: Prisma Migrate for schema management
- **Internationalization**: next-intl for multi-language support (English, Amharic, Oromo)

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

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: User accounts with authentication and profile information
- **Books**: Book catalog with inventory, pricing, and metadata
- **Articles**: Article content with status, pricing, and related articles
- **Blogs**: Blog posts with comments, tags, and featured content
- **BlogComments**: Comment system for blogs with parent-child relationships
- **Categories**: Hierarchical category system for books, articles, and blogs
- **Orders**: Customer orders with line items, payments, and tracking
- **Payments**: Payment transactions with multiple payment methods
- **Reviews**: Book reviews with ratings and helpfulness voting
- **Addresses**: User shipping addresses
- **Files**: File metadata and storage information (MinIO integration)
- **Sessions**: User authentication sessions
- **Roles**: Role-based access control system
- **Invitations**: Store member invitation system

## 🔐 Authentication & Security

### Authentication System
- **Session-based Authentication**: Secure session management with HTTP-only cookies
****- **Multi-Provider Support**: Email/password, Google OAuth, and GitHub OAuth integration
- **Session Validation**: Real-time session validation with automatic logout on expiration
- **Device Tracking**: Track login devices and sessions for security monitoring

### Role-Based Access Control (RBAC)
- **User Roles**: 
  - `user` - Regular user with content access and shopping capabilities
  - `admin` - Platform administrator with full content and user management access
  - `superAdmin` - System owner with full platform control
- **Content Roles**: Role-based permissions for managing books, articles, blogs, and media
- **Invitation System**: Secure member invitations with pending/accepted/rejected status tracking

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

## 📖 Website Content Structure

### Proposed Website Sections

1. **Hero / Landing Section**
   - Name, Title: *Ustaz Ahmedin Jebel – Preacher · Historian · Community Advocate*
   - Tagline: *"Promoting faith, heritage and justice for Ethiopian Muslims"*
   - Hero image/video of public speaking

2. **Biography**
   - Short and detailed biography versions
   - Interactive timeline of key dates and events
   - Roles and institutional affiliations

3. **Focus Areas**
   - Education & Dawah
   - Historical Research & Publications
   - Community Rights & Advocacy
   - Youth Engagement & Mobilisation

4. **Publications & Media**
   - Book listings with purchase options
   - Media gallery with embedded YouTube videos
   - Links to social media channels

5. **Advocacy & Impact**
   - Community work showcase
   - Notable quotes and speech excerpts
   - Regional work mapping

6. **Contact & Engagement**
   - Speaking requests
   - Contact form
   - Social media links
   - Newsletter subscription

### Content Tone & Style

- **Respectful**: Dignified language appropriate for a religious educator and public figure
- **Service-Oriented**: Emphasize service, community upliftment, heritage, and education
- **Factual**: Present controversies and challenges factually without partisan language
- **Accessible**: Use clear language for general audience while maintaining accuracy
- **Action-Oriented**: Include calls-to-action like "Watch latest talk", "Download book", "Follow on social media"

> **Note**: The information on this website is based on publicly available sources. For the most current information or to verify specific details, users are advised to consult primary sources or official channels.

## 🔄 Version History

- **v1.0.0**: Initial release
  - Portfolio website for Ustaz Ahmedin Jebel
  - E-commerce functionality for books, articles, and blogs
  - Complete admin panel for content management
  - Multi-language support (English, Amharic, Oromo)
  - Modern UI with dark/light theme support
  - Secure authentication and authorization
  - Order management and payment processing
