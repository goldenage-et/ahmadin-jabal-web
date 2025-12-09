-- Add isPremium to User table
ALTER TABLE "user" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "user_isPremium_idx" ON "user"("isPremium");

-- Replace isFree with isPremium in Blog table (inverse logic: isPremium = !isFree)
-- First, add the new column
ALTER TABLE "blogs" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- Migrate data: isPremium = !isFree
UPDATE "blogs" SET "isPremium" = NOT "isFree";

-- Drop old index
DROP INDEX IF EXISTS "blogs_isFree_idx";
DROP INDEX IF EXISTS "blogs_status_isFree_idx";

-- Drop old column
ALTER TABLE "blogs" DROP COLUMN "isFree";

-- CreateIndex
CREATE INDEX "blogs_isPremium_idx" ON "blogs"("isPremium");
CREATE INDEX "blogs_status_isPremium_idx" ON "blogs"("status", "isPremium");

-- Add isPremium to Media table
ALTER TABLE "media" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "media_isPremium_idx" ON "media"("isPremium");
CREATE INDEX "media_status_isPremium_idx" ON "media"("status", "isPremium");

-- Add isPremium to Video table
ALTER TABLE "videos" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "videos_isPremium_idx" ON "videos"("isPremium");
CREATE INDEX "videos_status_isPremium_idx" ON "videos"("status", "isPremium");

-- Add isPremium to Audio table
ALTER TABLE "audios" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "audios_isPremium_idx" ON "audios"("isPremium");
CREATE INDEX "audios_status_isPremium_idx" ON "audios"("status", "isPremium");

-- Add isPremium to Photo table
ALTER TABLE "photos" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "photos_isPremium_idx" ON "photos"("isPremium");
CREATE INDEX "photos_status_isPremium_idx" ON "photos"("status", "isPremium");

-- Add isPremium to Gallery table
ALTER TABLE "galleries" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "galleries_isPremium_idx" ON "galleries"("isPremium");
CREATE INDEX "galleries_status_isPremium_idx" ON "galleries"("status", "isPremium");

-- Add isPremium to Newsletter table
ALTER TABLE "newsletters" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "newsletters_isPremium_idx" ON "newsletters"("isPremium");
CREATE INDEX "newsletters_status_isPremium_idx" ON "newsletters"("status", "isPremium");


