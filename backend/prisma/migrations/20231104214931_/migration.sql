-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_adress_id_fkey";

-- AlterTable
ALTER TABLE "public"."schools" ALTER COLUMN "adress_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
