/*
  Warnings:

  - You are about to drop the column `afternoon` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `afternoon_arrival` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `afternoon_departure` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `morning` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `morning_arrival` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `morning_departure` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `night` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `night_arrival` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `night_departure` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `afternoon` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `morning` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `night` on the `students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."schools" DROP COLUMN "afternoon",
DROP COLUMN "afternoon_arrival",
DROP COLUMN "afternoon_departure",
DROP COLUMN "morning",
DROP COLUMN "morning_arrival",
DROP COLUMN "morning_departure",
DROP COLUMN "night",
DROP COLUMN "night_arrival",
DROP COLUMN "night_departure",
ADD COLUMN     "arrival_time" TIMESTAMP(3),
ADD COLUMN     "departure_time" TIMESTAMP(3),
ADD COLUMN     "shift" "public"."Shift";

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "afternoon",
DROP COLUMN "morning",
DROP COLUMN "night",
ADD COLUMN     "shift" "public"."Shift";
