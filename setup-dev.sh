#!/bin/bash

# Development Environment Setup Script for ahmadin
echo "Setting up development environment for ahmadin..."

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Server Configuration
SERVER_PORT=8000
CLIENT_HOST=http://localhost:3000
SERVER_HOST=http://localhost:8000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ahmadin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-$(date +%s)
JWT_REFRESH_SECRET=your-super-secret-refresh-key-$(date +%s)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Environment
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

# Create client .env.local if it doesn't exist
if [ ! -f apps/client/.env.local ]; then
    echo "Creating client .env.local file..."
    cat > apps/client/.env.local << EOF
NEXT_PUBLIC_SERVER_HOST=http://localhost:8000
NEXT_PUBLIC_CLIENT_HOST=http://localhost:3000
NEXT_PUBLIC_MIMIO_HOST=http://localhost:9000
EOF
    echo "✅ Client .env.local file created"
else
    echo "⚠️  Client .env.local file already exists"
fi

echo ""
echo "🔧 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the DATABASE_URL in .env with your actual database credentials"
echo "2. Run 'pnpm install' to install dependencies"
echo "3. Start the development servers:"
echo "   - Server: pnpm run dev:server"
echo "   - Client: pnpm run dev:client"
echo ""
echo "The CORS and cookie issues should now be resolved!"
