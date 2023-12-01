/*
  Warnings:

  - You are about to drop the column `name` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "name",
ADD COLUMN     "day" TEXT,
ADD COLUMN     "time" TEXT;
