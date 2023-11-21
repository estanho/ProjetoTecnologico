-- AlterTable
ALTER TABLE "public"."students" ADD COLUMN     "driver_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
