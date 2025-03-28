-- CreateTable
CREATE TABLE "Site" (
    "site" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "details" JSON NOT NULL,
    "board" JSON NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("site")
);

-- CreateTable
CREATE TABLE "Patient" (
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mode" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patientId")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("site") ON DELETE RESTRICT ON UPDATE CASCADE;
