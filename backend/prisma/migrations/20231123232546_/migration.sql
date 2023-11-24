/*
  Warnings:

  - You are about to drop the column `day` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "day",
DROP COLUMN "time";
