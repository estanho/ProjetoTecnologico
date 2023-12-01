/*
  Warnings:

  - You are about to drop the column `responsible_absence_id` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_responsible_absence_id_fkey";

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "responsible_absence_id";
