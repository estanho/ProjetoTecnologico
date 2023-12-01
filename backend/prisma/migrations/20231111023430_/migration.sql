/*
  Warnings:

  - Added the required column `shift` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('morning', 'afternoon', 'night');

-- AlterTable
ALTER TABLE "public"."itineraries" ADD COLUMN     "shift" "public"."Shift" NOT NULL;
