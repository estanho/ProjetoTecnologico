/*
  Warnings:

  - Added the required column `order` to the `student_itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."student_itineraries" ADD COLUMN     "order" INTEGER NOT NULL;
