-- AlterTable
ALTER TABLE "public"."students_trips" ADD COLUMN     "authorized_absence_id" UUID;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_authorized_absence_id_fkey" FOREIGN KEY ("authorized_absence_id") REFERENCES "public"."responsibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
