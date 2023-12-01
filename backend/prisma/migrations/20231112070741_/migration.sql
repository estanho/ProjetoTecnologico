-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students_trips" DROP CONSTRAINT "students_trips_trip_id_fkey";

-- AlterTable
ALTER TABLE "public"."students_trips" ALTER COLUMN "student_id" DROP NOT NULL,
ALTER COLUMN "trip_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
