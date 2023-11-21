/*
  Warnings:

  - You are about to drop the column `afternoon` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `friday` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `monday` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `morning` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `night` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `itineraries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "afternoon",
DROP COLUMN "friday",
DROP COLUMN "monday",
DROP COLUMN "morning",
DROP COLUMN "night",
DROP COLUMN "thursday",
DROP COLUMN "tuesday",
DROP COLUMN "wednesday";

-- AlterTable
ALTER TABLE "public"."schools" ADD COLUMN     "afternoon" BOOLEAN,
ADD COLUMN     "morning" BOOLEAN,
ADD COLUMN     "night" BOOLEAN;
