/*
  Warnings:

  - Added the required column `place_id` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `sources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "place_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sources" ADD COLUMN     "place_id" TEXT NOT NULL;
