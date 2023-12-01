-- DropForeignKey
ALTER TABLE "public"."notifications_subscriptions" DROP CONSTRAINT "notifications_subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_driver_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications_subscriptions" ADD CONSTRAINT "notifications_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
