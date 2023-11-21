/*
  Warnings:

  - You are about to drop the column `itinerary_id` on the `schools` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_itinerary_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" ADD COLUMN     "school_id" UUID;

-- AlterTable
ALTER TABLE "public"."schools" DROP COLUMN "itinerary_id";

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
