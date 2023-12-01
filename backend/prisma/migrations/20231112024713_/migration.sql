/*
  Warnings:

  - You are about to drop the column `school_id` on the `addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[school_address_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_default_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_school_id_fkey";

-- DropIndex
DROP INDEX "public"."addresses_school_id_key";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "school_id",
ADD COLUMN     "school_address_id" UUID,
ADD COLUMN     "school_default_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_school_address_id_key" ON "public"."addresses"("school_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_school_default_id_key" ON "public"."addresses"("school_default_id");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_school_address_id_fkey" FOREIGN KEY ("school_address_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_school_default_id_fkey" FOREIGN KEY ("school_default_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
