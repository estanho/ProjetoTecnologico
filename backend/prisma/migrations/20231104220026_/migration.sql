-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_adress_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "public"."addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
