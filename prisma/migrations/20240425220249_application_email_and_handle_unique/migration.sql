/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "applications_handle_key" ON "applications"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "applications_email_key" ON "applications"("email");
