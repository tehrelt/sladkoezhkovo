-- CreateTable
CREATE TABLE "carts" (
    "user_id" TEXT NOT NULL,
    "catalogue_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("user_id","catalogue_id")
);

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "catalogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
