/*
  Warnings:

  - A unique constraint covering the columns `[product_id,package_id]` on the table `catalogue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "catalogue_product_id_package_id_key" ON "catalogue"("product_id", "package_id");
