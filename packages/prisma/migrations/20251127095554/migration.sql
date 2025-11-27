-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio', 'document');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('upload', 'youtube', 'vimeo', 'external');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('active', 'archived', 'deleted');

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "description" TEXT,
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
    "status" "MediaStatus" NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_media" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_media_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "media_publishedAt_idx" ON "media"("publishedAt");

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");

-- CreateIndex
CREATE INDEX "media_status_featured_idx" ON "media"("status", "featured");

-- CreateIndex
CREATE INDEX "media_type_status_idx" ON "media"("type", "status");

-- CreateIndex
CREATE INDEX "article_media_articleId_idx" ON "article_media"("articleId");

-- CreateIndex
CREATE INDEX "article_media_mediaId_idx" ON "article_media"("mediaId");

-- CreateIndex
CREATE INDEX "article_media_order_idx" ON "article_media"("order");

-- CreateIndex
CREATE UNIQUE INDEX "article_media_articleId_mediaId_key" ON "article_media"("articleId", "mediaId");

-- CreateIndex
CREATE INDEX "publication_media_publicationId_idx" ON "publication_media"("publicationId");

-- CreateIndex
CREATE INDEX "publication_media_mediaId_idx" ON "publication_media"("mediaId");

-- CreateIndex
CREATE INDEX "publication_media_order_idx" ON "publication_media"("order");

-- CreateIndex
CREATE UNIQUE INDEX "publication_media_publicationId_mediaId_key" ON "publication_media"("publicationId", "mediaId");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "article_media" ADD CONSTRAINT "article_media_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "article_media" ADD CONSTRAINT "article_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_media" ADD CONSTRAINT "publication_media_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_media" ADD CONSTRAINT "publication_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
