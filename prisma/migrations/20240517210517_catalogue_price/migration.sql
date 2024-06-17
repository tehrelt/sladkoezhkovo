/*
  Warnings:

  - You are about to drop the column `image_id` on the `catalogue` table. All the data in the column will be lost.
  - Added the required column `price` to the `catalogue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catalogue" DROP CONSTRAINT "catalogue_image_id_fkey";

-- AlterTable
ALTER TABLE "catalogue" DROP COLUMN "image_id",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
