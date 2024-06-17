-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_types" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "property_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confectionary_types" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "confectionary_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disctricts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "disctricts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factories" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "property_type_id" TEXT NOT NULL,
    "image_id" TEXT,

    CONSTRAINT "factories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "confectionary_type_id" TEXT NOT NULL,
    "factory_id" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogue" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "product_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "unit_id" TEXT,
    "image_id" TEXT,

    CONSTRAINT "catalogue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "district_id" TEXT NOT NULL,
    "open_since" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "employees_count" INTEGER NOT NULL,
    "image_id" TEXT,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_entries" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "shipment_id" TEXT NOT NULL,
    "catalogue_id" TEXT NOT NULL,

    CONSTRAINT "shipment_entries_pkey" PRIMARY KEY ("shipment_id","catalogue_id")
);

-- CreateTable
CREATE TABLE "images" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "property_types_name_key" ON "property_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "confectionary_types_name_key" ON "confectionary_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "packages_name_key" ON "packages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "disctricts_name_key" ON "disctricts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "factories_name_key" ON "factories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "factories_handle_key" ON "factories"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "shops_handle_key" ON "shops"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "images_link_key" ON "images"("link");

-- AddForeignKey
ALTER TABLE "disctricts" ADD CONSTRAINT "disctricts_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factories" ADD CONSTRAINT "factories_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factories" ADD CONSTRAINT "factories_property_type_id_fkey" FOREIGN KEY ("property_type_id") REFERENCES "property_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factories" ADD CONSTRAINT "factories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "factories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_confectionary_type_id_fkey" FOREIGN KEY ("confectionary_type_id") REFERENCES "confectionary_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "disctricts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_entries" ADD CONSTRAINT "shipment_entries_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_entries" ADD CONSTRAINT "shipment_entries_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "catalogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
