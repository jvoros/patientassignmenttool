/*
  Warnings:

  - You are about to drop the column `siteId` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `site` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_siteId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "siteId",
ADD COLUMN     "site" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Log" (
    "logId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "patients" INTEGER NOT NULL,
    "supervised" INTEGER NOT NULL,
    "site" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("logId")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_site_fkey" FOREIGN KEY ("site") REFERENCES "Site"("site") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_site_fkey" FOREIGN KEY ("site") REFERENCES "Site"("site") ON DELETE RESTRICT ON UPDATE CASCADE;
