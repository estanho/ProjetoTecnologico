-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_trip_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
