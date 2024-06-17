/*
  Warnings:

  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'SHOP_OWNER', 'FACTORY_OWNER');

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_roleId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "approved" DROP NOT NULL,
ALTER COLUMN "approved" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "roles";

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
