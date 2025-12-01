/*
  Warnings:

  - You are about to drop the column `titleEn` on the `audios` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `galleries` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `contentEn` on the `newsletters` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `newsletters` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `publications` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audios" DROP COLUMN "titleEn",
ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "titleEn",
ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "media" DROP COLUMN "titleEn",
ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "newsletters" DROP COLUMN "contentEn",
DROP COLUMN "titleEn",
ADD COLUMN     "contentAm" JSONB DEFAULT '{}',
ADD COLUMN     "contentOr" JSONB DEFAULT '{}',
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "titleEn",
ADD COLUMN     "captionAm" TEXT,
ADD COLUMN     "captionOm" TEXT,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "publications" DROP COLUMN "titleEn",
ADD COLUMN     "contentAm" JSONB,
ADD COLUMN     "contentOr" JSONB,
ADD COLUMN     "excerptAm" JSONB,
ADD COLUMN     "excerptOr" JSONB,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "titleEn",
ADD COLUMN     "descriptionAm" TEXT,
ADD COLUMN     "descriptionOr" TEXT,
ADD COLUMN     "titleAm" VARCHAR(255),
ADD COLUMN     "titleOr" VARCHAR(255);
