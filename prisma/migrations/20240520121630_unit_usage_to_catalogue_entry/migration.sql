/*
  Warnings:

  - Added the required column `unit_usage` to the `catalogue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "catalogue" ADD COLUMN     "unit_usage" INTEGER NOT NULL;
