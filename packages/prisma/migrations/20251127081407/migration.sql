/*
  Warnings:

  - You are about to drop the `blog_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_related` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- CreateEnum
CREATE TYPE "PublicationCommentStatus" AS ENUM ('pending', 'approved', 'rejected', 'spam', 'deleted');

-- DropForeignKey
ALTER TABLE "public"."blog_comments" DROP CONSTRAINT "blog_comments_blogId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_comments" DROP CONSTRAINT "blog_comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_comments" DROP CONSTRAINT "blog_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_related" DROP CONSTRAINT "blog_related_fromId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_related" DROP CONSTRAINT "blog_related_toId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."blogs" DROP CONSTRAINT "blogs_categoryId_fkey";

-- DropTable
DROP TABLE "public"."blog_comments";

-- DropTable
DROP TABLE "public"."blog_related";

-- DropTable
DROP TABLE "public"."blogs";

-- DropEnum
DROP TYPE "public"."BlogCommentStatus";

-- DropEnum
DROP TYPE "public"."BlogStatus";

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "excerpt" JSONB,
    "content" JSONB,
    "media" JSONB DEFAULT '[]',
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
CREATE INDEX "publications_publishedAt_idx" ON "publications"("publishedAt");

-- CreateIndex
CREATE INDEX "publications_slug_idx" ON "publications"("slug");

-- CreateIndex
CREATE INDEX "publications_status_featured_idx" ON "publications"("status", "featured");

-- CreateIndex
CREATE INDEX "publications_status_publishedAt_idx" ON "publications"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "publications_allowComments_idx" ON "publications"("allowComments");

-- CreateIndex
CREATE INDEX "publications_createdAt_idx" ON "publications"("createdAt");

-- CreateIndex
CREATE INDEX "publication_comments_publicationId_idx" ON "publication_comments"("publicationId");

-- CreateIndex
CREATE INDEX "publication_comments_userId_idx" ON "publication_comments"("userId");

-- CreateIndex
CREATE INDEX "publication_comments_parentId_idx" ON "publication_comments"("parentId");

-- CreateIndex
CREATE INDEX "publication_comments_status_idx" ON "publication_comments"("status");

-- CreateIndex
CREATE INDEX "publication_related_fromId_idx" ON "publication_related"("fromId");

-- CreateIndex
CREATE INDEX "publication_related_toId_idx" ON "publication_related"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "publication_related_fromId_toId_key" ON "publication_related"("fromId", "toId");

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
