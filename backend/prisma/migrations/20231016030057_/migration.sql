/*
  Warnings:

  - You are about to drop the `Student_trip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Student_trip";

-- CreateTable
CREATE TABLE "student_trip" (
    "id" TEXT NOT NULL,
    "embarked_at" TIMESTAMP(3) NOT NULL,
    "disembarked_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_trip_pkey" PRIMARY KEY ("id")
);
