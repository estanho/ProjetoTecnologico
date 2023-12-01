/*
  Warnings:

  - You are about to drop the column `authorized_absence_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `authorized_absence_id` on the `students_trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_authorized_absence_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_authorized_absence_id_fkey";

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "authorized_absence_id",
ADD COLUMN     "responsible_absence_id" UUID;

-- AlterTable
ALTER TABLE "public"."students_trips" DROP COLUMN "authorized_absence_id",
ADD COLUMN     "responsible_absence_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_responsible_absence_id_fkey" FOREIGN KEY ("responsible_absence_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_responsible_absence_id_fkey" FOREIGN KEY ("responsible_absence_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
