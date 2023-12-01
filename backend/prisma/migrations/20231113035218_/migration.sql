-- DropForeignKey
ALTER TABLE "public"."itineraries" DROP CONSTRAINT "itineraries_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trips" DROP CONSTRAINT "trips_itinerary_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trips" ADD CONSTRAINT "trips_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
