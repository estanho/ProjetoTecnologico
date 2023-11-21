/*
  Warnings:

  - You are about to drop the column `responsible_id` on the `students_trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_responsible_id_fkey";

-- AlterTable
ALTER TABLE "public"."students" ADD COLUMN     "authorized_absence_id" UUID;

-- AlterTable
ALTER TABLE "public"."students_trips" DROP COLUMN "responsible_id";

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_authorized_absence_id_fkey" FOREIGN KEY ("authorized_absence_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
