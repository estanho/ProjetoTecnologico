-- AlterTable
ALTER TABLE "public"."students_trips" ADD COLUMN     "responsible_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
