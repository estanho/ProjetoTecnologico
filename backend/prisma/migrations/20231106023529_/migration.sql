/*
  Warnings:

  - Added the required column `place_id` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "place_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."schools" ADD COLUMN     "status" BOOLEAN;
