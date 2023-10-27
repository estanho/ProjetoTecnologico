/*
  Warnings:

  - Added the required column `itinerary_id` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "itinerary_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "student_itineraries" (
    "student_id" TEXT NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_itineraries_pkey" PRIMARY KEY ("student_id","itinerary_id")
);

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_itineraries" ADD CONSTRAINT "student_itineraries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_itineraries" ADD CONSTRAINT "student_itineraries_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
