/*
  Warnings:

  - You are about to drop the column `quantity` on the `catalogue` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `catalogue` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `shipment_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `shipment_entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catalogue" DROP CONSTRAINT "catalogue_unit_id_fkey";

-- AlterTable
ALTER TABLE "catalogue" DROP COLUMN "quantity",
DROP COLUMN "unit_id";

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "shipment_entries" ADD COLUMN     "cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "units" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
