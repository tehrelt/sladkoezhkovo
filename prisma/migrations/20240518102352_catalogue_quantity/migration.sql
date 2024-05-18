/*
  Warnings:

  - Added the required column `quantity` to the `catalogue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "catalogue" ADD COLUMN     "quantity" INTEGER NOT NULL;
