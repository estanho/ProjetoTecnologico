-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_school_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_student_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
