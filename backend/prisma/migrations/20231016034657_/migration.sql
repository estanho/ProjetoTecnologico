/*
  Warnings:

  - You are about to drop the `student_trip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `afternoon` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goes` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morning` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `night` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itinerary_id` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "afternoon" BOOLEAN NOT NULL,
ADD COLUMN     "goes" BOOLEAN NOT NULL,
ADD COLUMN     "morning" BOOLEAN NOT NULL,
ADD COLUMN     "night" BOOLEAN NOT NULL,
ADD COLUMN     "return" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "itinerary_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "student_trip";

-- CreateTable
CREATE TABLE "student_trips" (
    "id" TEXT NOT NULL,
    "embarked_at" TIMESTAMP(3) NOT NULL,
    "disembarked_at" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_trips" ADD CONSTRAINT "student_trips_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_trips" ADD CONSTRAINT "student_trips_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
