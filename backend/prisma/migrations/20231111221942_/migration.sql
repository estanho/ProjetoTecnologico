/*
  Warnings:

  - You are about to drop the column `arrival_time` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `departure_time` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `finished_at` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `going` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `return` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `shift` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `starting_estimate` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the `student_itineraries` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TypeTrip" AS ENUM ('going_morning', 'return_morning', 'going_afternoon_return_morning', 'going_afternoon', 'return_afternoon', 'going_night_return_afternoon', 'going_night', 'return_night');

-- DropForeignKey
ALTER TABLE "public"."student_itineraries" DROP CONSTRAINT "student_itineraries_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_itineraries" DROP CONSTRAINT "student_itineraries_student_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" DROP COLUMN "arrival_time",
DROP COLUMN "departure_time",
DROP COLUMN "duration",
DROP COLUMN "finished_at",
DROP COLUMN "going",
DROP COLUMN "path",
DROP COLUMN "return",
DROP COLUMN "shift",
DROP COLUMN "started_at",
DROP COLUMN "starting_estimate";

-- DropTable
DROP TABLE "public"."student_itineraries";

-- CreateTable
CREATE TABLE "public"."trips" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shift" "public"."Shift" NOT NULL,
    "path" JSON,
    "duration" INTEGER,
    "starting_estimate" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itinerary_id" UUID NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students_trips" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order" INTEGER NOT NULL,
    "absent" BOOLEAN NOT NULL,
    "embarked_at" TIMESTAMP(3) NOT NULL,
    "disembarked_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,

    CONSTRAINT "students_trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."trips" ADD CONSTRAINT "trips_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students_trips" ADD CONSTRAINT "students_trips_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
