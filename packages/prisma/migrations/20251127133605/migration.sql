-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'cancelled');

-- CreateEnum
CREATE TYPE "NewsletterSubscriptionStatus" AS ENUM ('subscribed', 'unsubscribed', 'bounced', 'blocked');

-- CreateEnum
CREATE TYPE "ContactSubmissionStatus" AS ENUM ('new', 'read', 'replied', 'archived');

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "description" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'active',
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
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "content" JSONB DEFAULT '{}',
    "contentEn" JSONB DEFAULT '{}',
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
    "status" "NewsletterSubscriptionStatus" NOT NULL DEFAULT 'subscribed',
    "source" VARCHAR(100),
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "lastEmailSent" TIMESTAMP(3),
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
CREATE INDEX "newsletter_subscriptions_status_subscribedAt_idx" ON "newsletter_subscriptions"("status", "subscribedAt");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "contact_submissions_userId_idx" ON "contact_submissions"("userId");

-- CreateIndex
CREATE INDEX "contact_submissions_inquiryType_idx" ON "contact_submissions"("inquiryType");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_status_createdAt_idx" ON "contact_submissions"("status", "createdAt");

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
