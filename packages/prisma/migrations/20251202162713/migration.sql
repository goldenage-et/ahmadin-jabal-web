-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('onDelivery', 'bankTransfer');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('payment', 'refund', 'payout');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('active', 'draft', 'archived');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected', 'hidden');

-- CreateEnum
CREATE TYPE "SearchAnalyticsSource" AS ENUM ('navigation', 'shop-page', 'suggestion-click');

-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('standard', 'express', 'pickup');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'blocked');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- CreateEnum
CREATE TYPE "PublicationCommentStatus" AS ENUM ('pending', 'approved', 'rejected', 'spam', 'deleted');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio', 'document');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('upload', 'youtube', 'external');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('published', 'draft', 'scheduled', 'deleted');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'cancelled');

-- CreateEnum
CREATE TYPE "NewsletterSubscriptionStatus" AS ENUM ('subscribed', 'unsubscribed', 'bounced', 'blocked');

-- CreateEnum
CREATE TYPE "NewsletterLanguage" AS ENUM ('en', 'am', 'om');

-- CreateEnum
CREATE TYPE "ContactSubmissionStatus" AS ENUM ('new', 'read', 'replied', 'archived');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "tokenType" TEXT,
    "idToken" TEXT,
    "expiresIn" INTEGER,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "zipCode" VARCHAR(20) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT 'No Name',
    "nameAm" VARCHAR(255),
    "nameOr" VARCHAR(255),
    "slug" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "image" JSONB,
    "iconName" VARCHAR(50),
    "backgroundColor" VARCHAR(7),
    "parentId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "roles" TEXT[],
    "token" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "orderNumber" VARCHAR(50) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'ETB',
    "shippingMethod" "ShippingMethod" NOT NULL,
    "trackingNumber" VARCHAR(100),
    "estimatedDelivery" TIMESTAMP(3),
    "notes" TEXT,
    "customerNotes" TEXT,
    "statusHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'ETB',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transactionId" VARCHAR(255),
    "referenceNumber" VARCHAR(255),
    "bankCode" VARCHAR(50),
    "bankAccountId" TEXT,
    "receiptData" JSONB,
    "metadata" JSONB,
    "failureReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(8) NOT NULL DEFAULT 'ETB',
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "referenceNumber" VARCHAR(255),
    "metadata" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_reviews" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "comment" TEXT,
    "images" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "subcategoryId" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "slug" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION,
    "images" JSONB DEFAULT '[]',
    "publisher" VARCHAR(255),
    "publisherAm" VARCHAR(255),
    "publisherOr" VARCHAR(255),
    "isbn" VARCHAR(100),
    "author" VARCHAR(255),
    "authorAm" VARCHAR(255),
    "authorOr" VARCHAR(255),
    "inventoryQuantity" INTEGER,
    "inventoryLowStockThreshold" INTEGER,
    "status" "BookStatus" NOT NULL DEFAULT 'active',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "saleCount" INTEGER NOT NULL DEFAULT 0,
    "saleAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "specifications" JSONB DEFAULT '[]',
    "expiresAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_helpful" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_helpful_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_reports" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "query" VARCHAR(255) NOT NULL,
    "resultCount" INTEGER,
    "filters" JSONB,
    "source" "SearchAnalyticsSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "searchCount" INTEGER NOT NULL DEFAULT 0,
    "location" VARCHAR(255),

    CONSTRAINT "search_analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "emailVerified" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL,
    "image" TEXT,
    "ltpHash" TEXT,
    "otpHash" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "permission" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "accountName" VARCHAR(255) NOT NULL,
    "accountNumber" VARCHAR(50) NOT NULL,
    "bankName" VARCHAR(255) NOT NULL,
    "bankCode" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'No Title',
    "titleAm" TEXT,
    "titleOr" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "excerptAm" TEXT,
    "excerptOr" TEXT,
    "content" JSONB DEFAULT '{}',
    "contentAm" JSONB,
    "contentOr" JSONB,
    "medias" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredImage" TEXT,
    "tags" TEXT[],
    "status" "BlogStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_related" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_related_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "excerpt" TEXT,
    "excerptAm" TEXT,
    "excerptOr" TEXT,
    "content" JSONB,
    "contentAm" JSONB,
    "contentOr" JSONB,
    "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredImage" TEXT,
    "tags" TEXT[],
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "allowComments" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_comments" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "status" "PublicationCommentStatus" NOT NULL DEFAULT 'pending',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publication_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_related" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_related_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "type" "MediaType" NOT NULL,
    "category" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "thumbnail" VARCHAR(500),
    "duration" INTEGER,
    "fileSize" INTEGER,
    "mimeType" VARCHAR(100),
    "width" INTEGER,
    "height" INTEGER,
    "source" "MediaSource" NOT NULL DEFAULT 'upload',
    "externalId" VARCHAR(255),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'draft',
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_media" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_media" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "category" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "thumbnail" VARCHAR(500),
    "duration" INTEGER,
    "fileSize" INTEGER,
    "mimeType" VARCHAR(100),
    "width" INTEGER,
    "height" INTEGER,
    "source" "MediaSource" NOT NULL DEFAULT 'upload',
    "externalId" VARCHAR(255),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'draft',
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "category" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "thumbnail" VARCHAR(500),
    "duration" INTEGER,
    "fileSize" INTEGER,
    "mimeType" VARCHAR(100),
    "source" "MediaSource" NOT NULL DEFAULT 'upload',
    "externalId" VARCHAR(255),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'draft',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT,

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255),
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "caption" TEXT,
    "captionAm" TEXT,
    "captionOr" TEXT,
    "alt" VARCHAR(255),
    "category" VARCHAR(100),
    "url" VARCHAR(500) NOT NULL,
    "thumbnail" VARCHAR(500),
    "fileSize" INTEGER,
    "mimeType" VARCHAR(100),
    "width" INTEGER,
    "height" INTEGER,
    "source" "MediaSource" NOT NULL DEFAULT 'upload',
    "externalId" VARCHAR(255),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'draft',
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "description" TEXT,
    "descriptionAm" TEXT,
    "descriptionOr" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'draft',
    "coverImage" VARCHAR(500),
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "subjectAm" VARCHAR(255),
    "subjectOr" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "titleAm" VARCHAR(255),
    "titleOr" VARCHAR(255),
    "content" JSONB DEFAULT '{}',
    "contentAm" JSONB DEFAULT '{}',
    "contentOr" JSONB DEFAULT '{}',
    "status" "NewsletterStatus" NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(255),
    "userId" TEXT,
    "language" "NewsletterLanguage" NOT NULL DEFAULT 'en',
    "status" "NewsletterSubscriptionStatus" NOT NULL DEFAULT 'subscribed',
    "source" VARCHAR(100),
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "lastEmailSent" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "inquiryType" VARCHAR(100),
    "status" "ContactSubmissionStatus" NOT NULL DEFAULT 'new',
    "userId" TEXT,
    "repliedAt" TIMESTAMP(3),
    "repliedBy" TEXT,
    "replyMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_user_roles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user_roles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_provider_providerId_idx" ON "accounts"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerId_userId_key" ON "accounts"("provider", "providerId", "userId");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "addresses_userId_isDefault_idx" ON "addresses"("userId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_active_idx" ON "categories"("active");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_token_key" ON "invitation"("token");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "invitation_invitedBy_idx" ON "invitation"("invitedBy");

-- CreateIndex
CREATE INDEX "invitation_targetId_idx" ON "invitation"("targetId");

-- CreateIndex
CREATE INDEX "invitation_status_idx" ON "invitation"("status");

-- CreateIndex
CREATE INDEX "invitation_token_idx" ON "invitation"("token");

-- CreateIndex
CREATE INDEX "invitation_expiresAt_idx" ON "invitation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_email_targetId_status_key" ON "invitation"("email", "targetId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_unique" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_trackingNumber_key" ON "orders"("trackingNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_bookId_idx" ON "orders"("bookId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "orders_userId_status_idx" ON "orders"("userId", "status");

-- CreateIndex
CREATE INDEX "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "orders_status_paymentStatus_idx" ON "orders"("status", "paymentStatus");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_paymentStatus_idx" ON "payments"("paymentStatus");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "payments_orderId_paymentStatus_idx" ON "payments"("orderId", "paymentStatus");

-- CreateIndex
CREATE INDEX "payments_userId_paymentStatus_idx" ON "payments"("userId", "paymentStatus");

-- CreateIndex
CREATE INDEX "payments_paidAt_idx" ON "payments"("paidAt");

-- CreateIndex
CREATE INDEX "transactions_paymentId_idx" ON "transactions"("paymentId");

-- CreateIndex
CREATE INDEX "transactions_orderId_idx" ON "transactions"("orderId");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "transactions_userId_status_idx" ON "transactions"("userId", "status");

-- CreateIndex
CREATE INDEX "transactions_userId_type_idx" ON "transactions"("userId", "type");

-- CreateIndex
CREATE INDEX "transactions_status_type_idx" ON "transactions"("status", "type");

-- CreateIndex
CREATE INDEX "transactions_processedAt_idx" ON "transactions"("processedAt");

-- CreateIndex
CREATE INDEX "book_reviews_bookId_idx" ON "book_reviews"("bookId");

-- CreateIndex
CREATE INDEX "book_reviews_userId_idx" ON "book_reviews"("userId");

-- CreateIndex
CREATE INDEX "book_reviews_orderId_idx" ON "book_reviews"("orderId");

-- CreateIndex
CREATE INDEX "book_reviews_status_idx" ON "book_reviews"("status");

-- CreateIndex
CREATE INDEX "book_reviews_rating_idx" ON "book_reviews"("rating");

-- CreateIndex
CREATE INDEX "book_reviews_verified_idx" ON "book_reviews"("verified");

-- CreateIndex
CREATE INDEX "book_reviews_bookId_status_idx" ON "book_reviews"("bookId", "status");

-- CreateIndex
CREATE INDEX "book_reviews_bookId_rating_idx" ON "book_reviews"("bookId", "rating");

-- CreateIndex
CREATE INDEX "book_reviews_status_rating_idx" ON "book_reviews"("status", "rating");

-- CreateIndex
CREATE INDEX "book_reviews_createdAt_idx" ON "book_reviews"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "book_reviews_bookId_userId_key" ON "book_reviews"("bookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- CreateIndex
CREATE INDEX "books_categoryId_idx" ON "books"("categoryId");

-- CreateIndex
CREATE INDEX "books_subcategoryId_idx" ON "books"("subcategoryId");

-- CreateIndex
CREATE INDEX "books_status_idx" ON "books"("status");

-- CreateIndex
CREATE INDEX "books_featured_idx" ON "books"("featured");

-- CreateIndex
CREATE INDEX "books_slug_idx" ON "books"("slug");

-- CreateIndex
CREATE INDEX "books_isbn_idx" ON "books"("isbn");

-- CreateIndex
CREATE INDEX "books_status_featured_idx" ON "books"("status", "featured");

-- CreateIndex
CREATE INDEX "books_status_publishedAt_idx" ON "books"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "books_publishedAt_idx" ON "books"("publishedAt");

-- CreateIndex
CREATE INDEX "books_createdAt_idx" ON "books"("createdAt");

-- CreateIndex
CREATE INDEX "books_rating_idx" ON "books"("rating");

-- CreateIndex
CREATE INDEX "books_saleCount_idx" ON "books"("saleCount");

-- CreateIndex
CREATE INDEX "review_helpful_reviewId_idx" ON "review_helpful"("reviewId");

-- CreateIndex
CREATE INDEX "review_helpful_userId_idx" ON "review_helpful"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "review_helpful_reviewId_userId_key" ON "review_helpful"("reviewId", "userId");

-- CreateIndex
CREATE INDEX "review_reports_reviewId_idx" ON "review_reports"("reviewId");

-- CreateIndex
CREATE INDEX "review_reports_userId_idx" ON "review_reports"("userId");

-- CreateIndex
CREATE INDEX "review_reports_status_idx" ON "review_reports"("status");

-- CreateIndex
CREATE INDEX "review_reports_createdAt_idx" ON "review_reports"("createdAt");

-- CreateIndex
CREATE INDEX "review_reports_status_createdAt_idx" ON "review_reports"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "review_reports_reviewId_userId_key" ON "review_reports"("reviewId", "userId");

-- CreateIndex
CREATE INDEX "search_analytics_events_userId_idx" ON "search_analytics_events"("userId");

-- CreateIndex
CREATE INDEX "search_analytics_events_source_idx" ON "search_analytics_events"("source");

-- CreateIndex
CREATE INDEX "search_analytics_events_createdAt_idx" ON "search_analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "search_analytics_events_query_idx" ON "search_analytics_events"("query");

-- CreateIndex
CREATE INDEX "search_analytics_events_userId_createdAt_idx" ON "search_analytics_events"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_id_unique" ON "session"("sessionId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

-- CreateIndex
CREATE INDEX "session_sessionId_idx" ON "session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_phone_idx" ON "user"("phone");

-- CreateIndex
CREATE INDEX "user_active_idx" ON "user"("active");

-- CreateIndex
CREATE INDEX "user_deletedAt_idx" ON "user"("deletedAt");

-- CreateIndex
CREATE INDEX "user_emailVerified_idx" ON "user"("emailVerified");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "roles_active_idx" ON "roles"("active");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "roles"("name");

-- CreateIndex
CREATE INDEX "bank_accounts_active_idx" ON "bank_accounts"("active");

-- CreateIndex
CREATE INDEX "bank_accounts_bankCode_idx" ON "bank_accounts"("bankCode");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_bankName_accountNumber_key" ON "bank_accounts"("bankName", "accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");

-- CreateIndex
CREATE INDEX "blogs_categoryId_idx" ON "blogs"("categoryId");

-- CreateIndex
CREATE INDEX "blogs_status_idx" ON "blogs"("status");

-- CreateIndex
CREATE INDEX "blogs_featured_idx" ON "blogs"("featured");

-- CreateIndex
CREATE INDEX "blogs_isFree_idx" ON "blogs"("isFree");

-- CreateIndex
CREATE INDEX "blogs_publishedAt_idx" ON "blogs"("publishedAt");

-- CreateIndex
CREATE INDEX "blogs_slug_idx" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_status_featured_idx" ON "blogs"("status", "featured");

-- CreateIndex
CREATE INDEX "blogs_status_publishedAt_idx" ON "blogs"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blogs_authorId_status_idx" ON "blogs"("authorId", "status");

-- CreateIndex
CREATE INDEX "blogs_status_isFree_idx" ON "blogs"("status", "isFree");

-- CreateIndex
CREATE INDEX "blogs_createdAt_idx" ON "blogs"("createdAt");

-- CreateIndex
CREATE INDEX "blogs_viewCount_idx" ON "blogs"("viewCount");

-- CreateIndex
CREATE INDEX "blogs_likeCount_idx" ON "blogs"("likeCount");

-- CreateIndex
CREATE INDEX "blog_related_fromId_idx" ON "blog_related"("fromId");

-- CreateIndex
CREATE INDEX "blog_related_toId_idx" ON "blog_related"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_related_fromId_toId_key" ON "blog_related"("fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "publications_slug_key" ON "publications"("slug");

-- CreateIndex
CREATE INDEX "publications_authorId_idx" ON "publications"("authorId");

-- CreateIndex
CREATE INDEX "publications_categoryId_idx" ON "publications"("categoryId");

-- CreateIndex
CREATE INDEX "publications_status_idx" ON "publications"("status");

-- CreateIndex
CREATE INDEX "publications_featured_idx" ON "publications"("featured");

-- CreateIndex
CREATE INDEX "publications_isPremium_idx" ON "publications"("isPremium");

-- CreateIndex
CREATE INDEX "publications_publishedAt_idx" ON "publications"("publishedAt");

-- CreateIndex
CREATE INDEX "publications_slug_idx" ON "publications"("slug");

-- CreateIndex
CREATE INDEX "publications_status_featured_idx" ON "publications"("status", "featured");

-- CreateIndex
CREATE INDEX "publications_status_publishedAt_idx" ON "publications"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "publications_authorId_status_idx" ON "publications"("authorId", "status");

-- CreateIndex
CREATE INDEX "publications_status_isPremium_idx" ON "publications"("status", "isPremium");

-- CreateIndex
CREATE INDEX "publications_allowComments_idx" ON "publications"("allowComments");

-- CreateIndex
CREATE INDEX "publications_createdAt_idx" ON "publications"("createdAt");

-- CreateIndex
CREATE INDEX "publications_viewCount_idx" ON "publications"("viewCount");

-- CreateIndex
CREATE INDEX "publications_likeCount_idx" ON "publications"("likeCount");

-- CreateIndex
CREATE INDEX "publications_downloadCount_idx" ON "publications"("downloadCount");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_idx" ON "publication_comments"("publicationId");

-- CreateIndex
CREATE INDEX "publication_comments_userId_idx" ON "publication_comments"("userId");

-- CreateIndex
CREATE INDEX "publication_comments_parentId_idx" ON "publication_comments"("parentId");

-- CreateIndex
CREATE INDEX "publication_comments_status_idx" ON "publication_comments"("status");

-- CreateIndex
CREATE INDEX "publication_comments_createdAt_idx" ON "publication_comments"("createdAt");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_status_idx" ON "publication_comments"("publicationId", "status");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_parentId_idx" ON "publication_comments"("publicationId", "parentId");

-- CreateIndex
CREATE INDEX "publication_related_fromId_idx" ON "publication_related"("fromId");

-- CreateIndex
CREATE INDEX "publication_related_toId_idx" ON "publication_related"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "publication_related_fromId_toId_key" ON "publication_related"("fromId", "toId");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_category_idx" ON "media"("category");

-- CreateIndex
CREATE INDEX "media_status_idx" ON "media"("status");

-- CreateIndex
CREATE INDEX "media_featured_idx" ON "media"("featured");

-- CreateIndex
CREATE INDEX "media_uploadedBy_idx" ON "media"("uploadedBy");

-- CreateIndex
CREATE INDEX "media_source_idx" ON "media"("source");

-- CreateIndex
CREATE INDEX "media_externalId_idx" ON "media"("externalId");

-- CreateIndex
CREATE INDEX "media_publishedAt_idx" ON "media"("publishedAt");

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- CreateIndex
CREATE INDEX "media_status_featured_idx" ON "media"("status", "featured");

-- CreateIndex
CREATE INDEX "media_type_status_idx" ON "media"("type", "status");

-- CreateIndex
CREATE INDEX "media_type_category_idx" ON "media"("type", "category");

-- CreateIndex
CREATE INDEX "media_viewCount_idx" ON "media"("viewCount");

-- CreateIndex
CREATE INDEX "media_likeCount_idx" ON "media"("likeCount");

-- CreateIndex
CREATE INDEX "blog_media_blogId_idx" ON "blog_media"("blogId");

-- CreateIndex
CREATE INDEX "blog_media_mediaId_idx" ON "blog_media"("mediaId");

-- CreateIndex
CREATE INDEX "blog_media_order_idx" ON "blog_media"("order");

-- CreateIndex
CREATE INDEX "blog_media_blogId_order_idx" ON "blog_media"("blogId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_media_blogId_mediaId_key" ON "blog_media"("blogId", "mediaId");

-- CreateIndex
CREATE INDEX "publication_media_publicationId_idx" ON "publication_media"("publicationId");

-- CreateIndex
CREATE INDEX "publication_media_mediaId_idx" ON "publication_media"("mediaId");

-- CreateIndex
CREATE INDEX "publication_media_order_idx" ON "publication_media"("order");

-- CreateIndex
CREATE INDEX "publication_media_publicationId_order_idx" ON "publication_media"("publicationId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "publication_media_publicationId_mediaId_key" ON "publication_media"("publicationId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_mediaId_key" ON "videos"("mediaId");

-- CreateIndex
CREATE INDEX "videos_category_idx" ON "videos"("category");

-- CreateIndex
CREATE INDEX "videos_status_idx" ON "videos"("status");

-- CreateIndex
CREATE INDEX "videos_featured_idx" ON "videos"("featured");

-- CreateIndex
CREATE INDEX "videos_uploadedBy_idx" ON "videos"("uploadedBy");

-- CreateIndex
CREATE INDEX "videos_source_idx" ON "videos"("source");

-- CreateIndex
CREATE INDEX "videos_externalId_idx" ON "videos"("externalId");

-- CreateIndex
CREATE INDEX "videos_publishedAt_idx" ON "videos"("publishedAt");

-- CreateIndex
CREATE INDEX "videos_createdAt_idx" ON "videos"("createdAt");

-- CreateIndex
CREATE INDEX "videos_status_featured_idx" ON "videos"("status", "featured");

-- CreateIndex
CREATE INDEX "videos_source_status_idx" ON "videos"("source", "status");

-- CreateIndex
CREATE INDEX "videos_viewCount_idx" ON "videos"("viewCount");

-- CreateIndex
CREATE INDEX "videos_likeCount_idx" ON "videos"("likeCount");

-- CreateIndex
CREATE UNIQUE INDEX "audios_mediaId_key" ON "audios"("mediaId");

-- CreateIndex
CREATE INDEX "audios_category_idx" ON "audios"("category");

-- CreateIndex
CREATE INDEX "audios_status_idx" ON "audios"("status");

-- CreateIndex
CREATE INDEX "audios_featured_idx" ON "audios"("featured");

-- CreateIndex
CREATE INDEX "audios_isAvailable_idx" ON "audios"("isAvailable");

-- CreateIndex
CREATE INDEX "audios_uploadedBy_idx" ON "audios"("uploadedBy");

-- CreateIndex
CREATE INDEX "audios_source_idx" ON "audios"("source");

-- CreateIndex
CREATE INDEX "audios_externalId_idx" ON "audios"("externalId");

-- CreateIndex
CREATE INDEX "audios_publishedAt_idx" ON "audios"("publishedAt");

-- CreateIndex
CREATE INDEX "audios_createdAt_idx" ON "audios"("createdAt");

-- CreateIndex
CREATE INDEX "audios_status_featured_idx" ON "audios"("status", "featured");

-- CreateIndex
CREATE INDEX "audios_category_status_idx" ON "audios"("category", "status");

-- CreateIndex
CREATE INDEX "audios_status_isAvailable_idx" ON "audios"("status", "isAvailable");

-- CreateIndex
CREATE INDEX "audios_viewCount_idx" ON "audios"("viewCount");

-- CreateIndex
CREATE INDEX "audios_likeCount_idx" ON "audios"("likeCount");

-- CreateIndex
CREATE UNIQUE INDEX "photos_mediaId_key" ON "photos"("mediaId");

-- CreateIndex
CREATE INDEX "photos_category_idx" ON "photos"("category");

-- CreateIndex
CREATE INDEX "photos_status_idx" ON "photos"("status");

-- CreateIndex
CREATE INDEX "photos_featured_idx" ON "photos"("featured");

-- CreateIndex
CREATE INDEX "photos_uploadedBy_idx" ON "photos"("uploadedBy");

-- CreateIndex
CREATE INDEX "photos_source_idx" ON "photos"("source");

-- CreateIndex
CREATE INDEX "photos_externalId_idx" ON "photos"("externalId");

-- CreateIndex
CREATE INDEX "photos_publishedAt_idx" ON "photos"("publishedAt");

-- CreateIndex
CREATE INDEX "photos_createdAt_idx" ON "photos"("createdAt");

-- CreateIndex
CREATE INDEX "photos_status_featured_idx" ON "photos"("status", "featured");

-- CreateIndex
CREATE INDEX "photos_category_status_idx" ON "photos"("category", "status");

-- CreateIndex
CREATE INDEX "photos_viewCount_idx" ON "photos"("viewCount");

-- CreateIndex
CREATE INDEX "photos_likeCount_idx" ON "photos"("likeCount");

-- CreateIndex
CREATE UNIQUE INDEX "galleries_slug_key" ON "galleries"("slug");

-- CreateIndex
CREATE INDEX "galleries_category_idx" ON "galleries"("category");

-- CreateIndex
CREATE INDEX "galleries_status_idx" ON "galleries"("status");

-- CreateIndex
CREATE INDEX "galleries_featured_idx" ON "galleries"("featured");

-- CreateIndex
CREATE INDEX "galleries_slug_idx" ON "galleries"("slug");

-- CreateIndex
CREATE INDEX "galleries_createdBy_idx" ON "galleries"("createdBy");

-- CreateIndex
CREATE INDEX "galleries_publishedAt_idx" ON "galleries"("publishedAt");

-- CreateIndex
CREATE INDEX "galleries_createdAt_idx" ON "galleries"("createdAt");

-- CreateIndex
CREATE INDEX "galleries_status_featured_idx" ON "galleries"("status", "featured");

-- CreateIndex
CREATE INDEX "gallery_photos_galleryId_idx" ON "gallery_photos"("galleryId");

-- CreateIndex
CREATE INDEX "gallery_photos_photoId_idx" ON "gallery_photos"("photoId");

-- CreateIndex
CREATE INDEX "gallery_photos_order_idx" ON "gallery_photos"("order");

-- CreateIndex
CREATE INDEX "gallery_photos_galleryId_order_idx" ON "gallery_photos"("galleryId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_photos_galleryId_photoId_key" ON "gallery_photos"("galleryId", "photoId");

-- CreateIndex
CREATE INDEX "newsletters_status_idx" ON "newsletters"("status");

-- CreateIndex
CREATE INDEX "newsletters_createdBy_idx" ON "newsletters"("createdBy");

-- CreateIndex
CREATE INDEX "newsletters_scheduledAt_idx" ON "newsletters"("scheduledAt");

-- CreateIndex
CREATE INDEX "newsletters_sentAt_idx" ON "newsletters"("sentAt");

-- CreateIndex
CREATE INDEX "newsletters_createdAt_idx" ON "newsletters"("createdAt");

-- CreateIndex
CREATE INDEX "newsletters_status_scheduledAt_idx" ON "newsletters"("status", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_key" ON "newsletter_subscriptions"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_idx" ON "newsletter_subscriptions"("status");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_userId_idx" ON "newsletter_subscriptions"("userId");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_subscribedAt_idx" ON "newsletter_subscriptions"("subscribedAt");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_unsubscribedAt_idx" ON "newsletter_subscriptions"("unsubscribedAt");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_subscribedAt_idx" ON "newsletter_subscriptions"("status", "subscribedAt");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_unsubscribedAt_idx" ON "newsletter_subscriptions"("status", "unsubscribedAt");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_userId_idx" ON "contact_submissions"("userId");

-- CreateIndex
CREATE INDEX "contact_submissions_repliedBy_idx" ON "contact_submissions"("repliedBy");

-- CreateIndex
CREATE INDEX "contact_submissions_inquiryType_idx" ON "contact_submissions"("inquiryType");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_status_createdAt_idx" ON "contact_submissions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_repliedAt_idx" ON "contact_submissions"("repliedAt");

-- CreateIndex
CREATE INDEX "_user_roles_B_index" ON "_user_roles"("B");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_helpful" ADD CONSTRAINT "review_helpful_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "book_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_helpful" ADD CONSTRAINT "review_helpful_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "book_reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "search_analytics_events" ADD CONSTRAINT "search_analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_related" ADD CONSTRAINT "blog_related_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_related" ADD CONSTRAINT "blog_related_toId_fkey" FOREIGN KEY ("toId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_comments" ADD CONSTRAINT "publication_comments_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_comments" ADD CONSTRAINT "publication_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_comments" ADD CONSTRAINT "publication_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "publication_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_related" ADD CONSTRAINT "publication_related_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_related" ADD CONSTRAINT "publication_related_toId_fkey" FOREIGN KEY ("toId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_media" ADD CONSTRAINT "blog_media_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_media" ADD CONSTRAINT "blog_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_media" ADD CONSTRAINT "publication_media_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_media" ADD CONSTRAINT "publication_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audios" ADD CONSTRAINT "audios_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audios" ADD CONSTRAINT "audios_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsletters" ADD CONSTRAINT "newsletters_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_repliedBy_fkey" FOREIGN KEY ("repliedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_user_roles" ADD CONSTRAINT "_user_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_roles" ADD CONSTRAINT "_user_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
