/*
  Warnings:

  - You are about to drop the column `subscription` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "subscription",
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "public"."notifications_subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscription" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,

    CONSTRAINT "notifications_subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notifications_subscriptions" ADD CONSTRAINT "notifications_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
