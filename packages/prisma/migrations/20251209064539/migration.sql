-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "planId" TEXT,
ALTER COLUMN "bookId" DROP NOT NULL,
ALTER COLUMN "shippingAddress" DROP NOT NULL,
ALTER COLUMN "shippingMethod" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "orders_planId_idx" ON "orders"("planId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
