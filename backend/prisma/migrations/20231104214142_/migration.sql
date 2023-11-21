/*
  Warnings:

  - Added the required column `driver_id` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."schools" ADD COLUMN     "driver_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
