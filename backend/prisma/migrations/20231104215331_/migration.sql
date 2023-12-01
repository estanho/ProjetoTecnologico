-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_driver_id_fkey";

-- AlterTable
ALTER TABLE "public"."schools" ALTER COLUMN "driver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
