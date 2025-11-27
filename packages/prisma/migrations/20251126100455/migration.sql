/*
  Warnings:

  - You are about to drop the column `contentEn` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `articles` table. All the data in the column will be lost.
  - The `title` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `excerpt` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `content` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `contentEn` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `blogs` table. All the data in the column will be lost.
  - The `excerpt` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `content` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "contentEn",
DROP COLUMN "images",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle",
DROP COLUMN "titleEn",
ADD COLUMN     "medias" JSONB DEFAULT '[]',
DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL DEFAULT '{}',
DROP COLUMN "excerpt",
ADD COLUMN     "excerpt" JSONB,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "contentEn",
DROP COLUMN "images",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaTitle",
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "media" JSONB DEFAULT '[]',
DROP COLUMN "excerpt",
ADD COLUMN     "excerpt" JSONB,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB;
