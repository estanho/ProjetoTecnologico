/*
  Warnings:

  - You are about to drop the column `responsible_absence_id` on the `students_trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_responsible_absence_id_fkey";

-- AlterTable
ALTER TABLE "public"."students" ADD COLUMN     "responsible_absence_going_id" UUID,
ADD COLUMN     "responsible_absence_return_id" UUID;

-- AlterTable
ALTER TABLE "public"."students_trips" DROP COLUMN "responsible_absence_id";

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_responsible_absence_going_id_fkey" FOREIGN KEY ("responsible_absence_going_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_responsible_absence_return_id_fkey" FOREIGN KEY ("responsible_absence_return_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
