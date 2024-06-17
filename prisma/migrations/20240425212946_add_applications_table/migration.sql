-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "roleId" TEXT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
