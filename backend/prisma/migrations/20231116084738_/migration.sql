/*
  Warnings:

  - The `km` column on the `trips` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."trips" DROP COLUMN "km",
ADD COLUMN     "km" DOUBLE PRECISION;
