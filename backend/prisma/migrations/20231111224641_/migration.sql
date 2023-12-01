/*
  Warnings:

  - You are about to drop the column `school_id` on the `itineraries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."itineraries" DROP CONSTRAINT "itineraries_school_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "school_id",
ADD COLUMN     "school_afternoon_id" UUID,
ADD COLUMN     "school_morning_id" UUID,
ADD COLUMN     "school_night_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_morning_id_fkey" FOREIGN KEY ("school_morning_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_afternoon_id_fkey" FOREIGN KEY ("school_afternoon_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_night_id_fkey" FOREIGN KEY ("school_night_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
