/*
  Warnings:

  - You are about to drop the column `disembarked_at` on the `students_trips` table. All the data in the column will be lost.
  - You are about to drop the column `embarked_at` on the `students_trips` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TypeTripStudent" AS ENUM ('embarked', 'disembarked');

-- AlterTable
ALTER TABLE "public"."students_trips" DROP COLUMN "disembarked_at",
DROP COLUMN "embarked_at",
ADD COLUMN     "time" TIMESTAMP(3),
ADD COLUMN     "type" "public"."TypeTripStudent";
