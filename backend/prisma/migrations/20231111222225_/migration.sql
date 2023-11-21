/*
  Warnings:

  - Added the required column `type` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."trips" ADD COLUMN     "type" "public"."TypeTrip" NOT NULL;
