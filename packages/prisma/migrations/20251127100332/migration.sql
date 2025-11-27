-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "description" TEXT,
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
    "mediaId" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "titleEn" VARCHAR(255),
    "description" TEXT,
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
    "status" "MediaStatus" NOT NULL DEFAULT 'active',
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
    "titleEn" VARCHAR(255),
    "caption" TEXT,
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
    "status" "MediaStatus" NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "uploadedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

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
