/*
  Warnings:

  - You are about to drop the column `starting_estimate` on the `trips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."trips" DROP COLUMN "starting_estimate",
ADD COLUMN     "estimated" TIMESTAMP(3);
