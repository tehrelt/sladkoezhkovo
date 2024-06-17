-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_id" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
