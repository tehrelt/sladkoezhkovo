-- CreateTable
CREATE TABLE "notfications" (
    "shipment_id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notfications_pkey" PRIMARY KEY ("shipment_id")
);

-- AddForeignKey
ALTER TABLE "notfications" ADD CONSTRAINT "notfications_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
