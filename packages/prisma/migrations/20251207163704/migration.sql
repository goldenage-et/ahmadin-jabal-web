-- AlterTable
ALTER TABLE "books" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "books_isPremium_idx" ON "books"("isPremium");

-- CreateIndex
CREATE INDEX "books_status_isPremium_idx" ON "books"("status", "isPremium");
