/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "images_name_key" ON "images"("name");
