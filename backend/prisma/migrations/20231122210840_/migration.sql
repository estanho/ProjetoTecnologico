/*
  Warnings:

  - You are about to drop the column `name` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "name",
ADD COLUMN     "subscription" TEXT,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
