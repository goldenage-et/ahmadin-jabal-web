/*
  Warnings:

  - The `medias` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `captionOm` on the `photos` table. All the data in the column will be lost.
  - The `media` column on the `publications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NewsletterLanguage" AS ENUM ('en', 'am', 'om');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "contentAm" JSONB,
ADD COLUMN     "contentOr" JSONB,
ADD COLUMN     "excerptAm" TEXT,
ADD COLUMN     "excerptOr" TEXT,
ADD COLUMN     "titleAm" TEXT,
ADD COLUMN     "titleOr" TEXT,
DROP COLUMN "medias",
ADD COLUMN     "medias" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "title" SET DEFAULT 'No Title',
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "excerpt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "book_reviews" ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "authorAm" VARCHAR(255),
ADD COLUMN     "authorOr" VARCHAR(255),
ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "publisherAm" VARCHAR(255),
ADD COLUMN     "publisherOr" VARCHAR(255),
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "nameAm" VARCHAR(255),
ADD COLUMN     "nameOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "newsletter_subscriptions" ADD COLUMN     "language" "NewsletterLanguage" NOT NULL DEFAULT 'en',
ALTER COLUMN "lastEmailSent" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "newsletters" ADD COLUMN     "subjectAm" VARCHAR(255),
ADD COLUMN     "subjectOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "tax" SET DEFAULT 0,
ALTER COLUMN "shipping" SET DEFAULT 0,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "currency" SET DEFAULT 'ETB';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'ETB';

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "captionOm",
ADD COLUMN     "captionOr" TEXT;

-- AlterTable
ALTER TABLE "publications" ALTER COLUMN "excerpt" SET DATA TYPE TEXT,
DROP COLUMN "media",
ADD COLUMN     "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "excerptAm" SET DATA TYPE TEXT,
ALTER COLUMN "excerptOr" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'ETB';

-- CreateIndex
CREATE INDEX "article_media_articleId_order_idx" ON "article_media"("articleId", "order");

-- CreateIndex
CREATE INDEX "articles_isFree_idx" ON "articles"("isFree");

-- CreateIndex
CREATE INDEX "articles_authorId_status_idx" ON "articles"("authorId", "status");

-- CreateIndex
CREATE INDEX "articles_status_isFree_idx" ON "articles"("status", "isFree");

-- CreateIndex
CREATE INDEX "articles_viewCount_idx" ON "articles"("viewCount");

-- CreateIndex
CREATE INDEX "articles_likeCount_idx" ON "articles"("likeCount");

-- CreateIndex
CREATE INDEX "audios_status_isAvailable_idx" ON "audios"("status", "isAvailable");

-- CreateIndex
CREATE INDEX "audios_viewCount_idx" ON "audios"("viewCount");

-- CreateIndex
CREATE INDEX "audios_likeCount_idx" ON "audios"("likeCount");

-- CreateIndex
CREATE INDEX "book_reviews_verified_idx" ON "book_reviews"("verified");

-- CreateIndex
CREATE INDEX "book_reviews_bookId_rating_idx" ON "book_reviews"("bookId", "rating");

-- CreateIndex
CREATE INDEX "book_reviews_status_rating_idx" ON "book_reviews"("status", "rating");

-- CreateIndex
CREATE INDEX "books_status_publishedAt_idx" ON "books"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "books_rating_idx" ON "books"("rating");

-- CreateIndex
CREATE INDEX "books_saleCount_idx" ON "books"("saleCount");

-- CreateIndex
CREATE INDEX "contact_submissions_repliedBy_idx" ON "contact_submissions"("repliedBy");

-- CreateIndex
CREATE INDEX "contact_submissions_repliedAt_idx" ON "contact_submissions"("repliedAt");

-- CreateIndex
CREATE INDEX "gallery_photos_galleryId_order_idx" ON "gallery_photos"("galleryId", "order");

-- CreateIndex
CREATE INDEX "media_source_idx" ON "media"("source");

-- CreateIndex
CREATE INDEX "media_externalId_idx" ON "media"("externalId");

-- CreateIndex
CREATE INDEX "media_type_category_idx" ON "media"("type", "category");

-- CreateIndex
CREATE INDEX "media_viewCount_idx" ON "media"("viewCount");

-- CreateIndex
CREATE INDEX "media_likeCount_idx" ON "media"("likeCount");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_unsubscribedAt_idx" ON "newsletter_subscriptions"("unsubscribedAt");

-- CreateIndex
CREATE INDEX "newsletter_subscriptions_status_unsubscribedAt_idx" ON "newsletter_subscriptions"("status", "unsubscribedAt");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_paymentStatus_idx" ON "orders"("status", "paymentStatus");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "payments_orderId_paymentStatus_idx" ON "payments"("orderId", "paymentStatus");

-- CreateIndex
CREATE INDEX "payments_userId_paymentStatus_idx" ON "payments"("userId", "paymentStatus");

-- CreateIndex
CREATE INDEX "payments_paidAt_idx" ON "payments"("paidAt");

-- CreateIndex
CREATE INDEX "photos_viewCount_idx" ON "photos"("viewCount");

-- CreateIndex
CREATE INDEX "photos_likeCount_idx" ON "photos"("likeCount");

-- CreateIndex
CREATE INDEX "publication_comments_createdAt_idx" ON "publication_comments"("createdAt");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_status_idx" ON "publication_comments"("publicationId", "status");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_parentId_idx" ON "publication_comments"("publicationId", "parentId");

-- CreateIndex
CREATE INDEX "publication_media_publicationId_order_idx" ON "publication_media"("publicationId", "order");

-- CreateIndex
CREATE INDEX "publications_isPremium_idx" ON "publications"("isPremium");

-- CreateIndex
CREATE INDEX "publications_authorId_status_idx" ON "publications"("authorId", "status");

-- CreateIndex
CREATE INDEX "publications_status_isPremium_idx" ON "publications"("status", "isPremium");

-- CreateIndex
CREATE INDEX "publications_viewCount_idx" ON "publications"("viewCount");

-- CreateIndex
CREATE INDEX "publications_likeCount_idx" ON "publications"("likeCount");

-- CreateIndex
CREATE INDEX "publications_downloadCount_idx" ON "publications"("downloadCount");

-- CreateIndex
CREATE INDEX "review_reports_createdAt_idx" ON "review_reports"("createdAt");

-- CreateIndex
CREATE INDEX "review_reports_status_createdAt_idx" ON "review_reports"("status", "createdAt");

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
CREATE INDEX "videos_viewCount_idx" ON "videos"("viewCount");

-- CreateIndex
CREATE INDEX "videos_likeCount_idx" ON "videos"("likeCount");
