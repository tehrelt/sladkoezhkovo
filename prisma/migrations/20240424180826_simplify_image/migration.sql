/*
  Warnings:

  - You are about to drop the column `link` on the `images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "images_link_key";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "link";
