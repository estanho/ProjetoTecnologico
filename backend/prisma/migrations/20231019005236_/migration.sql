/*
  Warnings:

  - Added the required column `directions` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "directions" JSONB NOT NULL;
