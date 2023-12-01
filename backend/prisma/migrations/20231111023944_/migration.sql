/*
  Warnings:

  - Made the column `school_id` on table `itineraries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."itineraries" DROP CONSTRAINT "itineraries_school_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" ALTER COLUMN "path" DROP NOT NULL,
ALTER COLUMN "school_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
