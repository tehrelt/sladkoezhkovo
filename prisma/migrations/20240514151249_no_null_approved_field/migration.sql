/*
  Warnings:

  - Made the column `approved` on table `applications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "approved" SET NOT NULL,
ALTER COLUMN "approved" SET DEFAULT false;
