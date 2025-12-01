/*
  Warnings:

  - The values [vimeo] on the enum `MediaSource` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,archived] on the enum `MediaStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaSource_new" AS ENUM ('upload', 'youtube', 'external');
ALTER TABLE "public"."audios" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "public"."media" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "public"."photos" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "public"."videos" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "media" ALTER COLUMN "source" TYPE "MediaSource_new" USING ("source"::text::"MediaSource_new");
ALTER TABLE "videos" ALTER COLUMN "source" TYPE "MediaSource_new" USING ("source"::text::"MediaSource_new");
ALTER TABLE "audios" ALTER COLUMN "source" TYPE "MediaSource_new" USING ("source"::text::"MediaSource_new");
ALTER TABLE "photos" ALTER COLUMN "source" TYPE "MediaSource_new" USING ("source"::text::"MediaSource_new");
ALTER TYPE "MediaSource" RENAME TO "MediaSource_old";
ALTER TYPE "MediaSource_new" RENAME TO "MediaSource";
DROP TYPE "public"."MediaSource_old";
ALTER TABLE "audios" ALTER COLUMN "source" SET DEFAULT 'upload';
ALTER TABLE "media" ALTER COLUMN "source" SET DEFAULT 'upload';
ALTER TABLE "photos" ALTER COLUMN "source" SET DEFAULT 'upload';
ALTER TABLE "videos" ALTER COLUMN "source" SET DEFAULT 'upload';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MediaStatus_new" AS ENUM ('published', 'draft', 'scheduled', 'deleted');
ALTER TABLE "public"."audios" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."galleries" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."media" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."photos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."videos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "media" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TABLE "videos" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TABLE "audios" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TABLE "photos" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TABLE "galleries" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TYPE "MediaStatus" RENAME TO "MediaStatus_old";
ALTER TYPE "MediaStatus_new" RENAME TO "MediaStatus";
DROP TYPE "public"."MediaStatus_old";
ALTER TABLE "audios" ALTER COLUMN "status" SET DEFAULT 'draft';
ALTER TABLE "galleries" ALTER COLUMN "status" SET DEFAULT 'draft';
ALTER TABLE "media" ALTER COLUMN "status" SET DEFAULT 'draft';
ALTER TABLE "photos" ALTER COLUMN "status" SET DEFAULT 'draft';
ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- AlterTable
ALTER TABLE "audios" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "galleries" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "photos" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "status" SET DEFAULT 'draft';
