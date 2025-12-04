/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "barcode" VARCHAR(50),
ADD COLUMN     "sku" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "books_sku_key" ON "books"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "books_barcode_key" ON "books"("barcode");
