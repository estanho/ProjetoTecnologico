/*
  Warnings:

  - You are about to drop the `temporary_associations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `responsibles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."temporary_associations" DROP CONSTRAINT "temporary_associations_driver_id_fkey";

-- AlterTable
ALTER TABLE "public"."responsibles" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "registered" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "public"."students" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "registered" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "public"."temporary_associations";
