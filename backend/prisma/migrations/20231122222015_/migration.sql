/*
  Warnings:

  - The `subscription` column on the `notifications_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."notifications_subscriptions" DROP COLUMN "subscription",
ADD COLUMN     "subscription" JSONB;
