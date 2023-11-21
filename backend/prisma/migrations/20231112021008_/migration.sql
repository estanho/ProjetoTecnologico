/*
  Warnings:

  - A unique constraint covering the columns `[driver_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "driver_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_driver_id_key" ON "public"."addresses"("driver_id");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
