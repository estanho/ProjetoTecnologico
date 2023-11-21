/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `addresses` table. All the data in the column will be lost.
  - The primary key for the `drivers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itinerary_id` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `drivers` table. All the data in the column will be lost.
  - The primary key for the `itineraries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `saturday` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `itineraries` table. All the data in the column will be lost.
  - The primary key for the `places` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `responsibles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `responsibles` table. All the data in the column will be lost.
  - The primary key for the `routes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `routes` table. All the data in the column will be lost.
  - The primary key for the `schools` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `schools` table. All the data in the column will be lost.
  - The primary key for the `student_itineraries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `student_itineraries` table. All the data in the column will be lost.
  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `driver_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_trips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trips` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `responsibles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cnh` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `drivers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `day` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driver_id` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finished_at` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `itineraries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `places` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `responsibles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `responsibles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `routes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `destination_id` on the `routes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `source_id` on the `routes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `schools` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `adress_id` on the `schools` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itinerary_id` on the `schools` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `disembarked_at` to the `student_itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `embarked_at` to the `student_itineraries` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `student_itineraries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `path` to the `student_itineraries` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `student_id` on the `student_itineraries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itinerary_id` on the `student_itineraries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `user_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `school_id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `adress_id` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('StudentRole', 'ResponsibleRole', 'DriverRole');

-- DropForeignKey
ALTER TABLE "public"."drivers" DROP CONSTRAINT "drivers_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."routes" DROP CONSTRAINT "routes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."routes" DROP CONSTRAINT "routes_source_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_adress_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_itineraries" DROP CONSTRAINT "student_itineraries_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_itineraries" DROP CONSTRAINT "student_itineraries_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_trips" DROP CONSTRAINT "student_trips_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_trips" DROP CONSTRAINT "student_trips_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_adress_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_school_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."trips" DROP CONSTRAINT "trips_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_responsible_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_pkey",
DROP COLUMN "updated_at",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."drivers" DROP CONSTRAINT "drivers_pkey",
DROP COLUMN "itinerary_id",
DROP COLUMN "updated_at",
ADD COLUMN     "cnh" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "drivers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."itineraries" DROP CONSTRAINT "itineraries_pkey",
DROP COLUMN "saturday",
DROP COLUMN "updated_at",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "driver_id" UUID NOT NULL,
ADD COLUMN     "finished_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "path" JSON NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."places" DROP CONSTRAINT "places_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."responsibles" DROP CONSTRAINT "responsibles_pkey",
DROP COLUMN "updated_at",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "responsibles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."routes" DROP CONSTRAINT "routes_pkey",
DROP COLUMN "updated_at",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "destination_id",
ADD COLUMN     "destination_id" UUID NOT NULL,
DROP COLUMN "source_id",
ADD COLUMN     "source_id" UUID NOT NULL,
ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_pkey",
DROP COLUMN "updated_at",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "adress_id",
ADD COLUMN     "adress_id" UUID NOT NULL,
DROP COLUMN "itinerary_id",
ADD COLUMN     "itinerary_id" UUID NOT NULL,
ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."student_itineraries" DROP CONSTRAINT "student_itineraries_pkey",
DROP COLUMN "updated_at",
ADD COLUMN     "disembarked_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "embarked_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "path" JSON NOT NULL,
DROP COLUMN "student_id",
ADD COLUMN     "student_id" UUID NOT NULL,
DROP COLUMN "itinerary_id",
ADD COLUMN     "itinerary_id" UUID NOT NULL,
ADD CONSTRAINT "student_itineraries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "updated_at",
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "school_id",
ADD COLUMN     "school_id" UUID NOT NULL,
DROP COLUMN "adress_id",
ADD COLUMN     "adress_id" UUID NOT NULL,
ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "code",
DROP COLUMN "driver_id",
DROP COLUMN "responsible_id",
DROP COLUMN "role_id",
DROP COLUMN "type",
DROP COLUMN "updated_at",
ADD COLUMN     "first_login" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "public"."Role" NOT NULL;

-- DropTable
DROP TABLE "public"."roles";

-- DropTable
DROP TABLE "public"."student_trips";

-- DropTable
DROP TABLE "public"."trips";

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ResponsibleToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResponsibleToStudent_AB_unique" ON "public"."_ResponsibleToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ResponsibleToStudent_B_index" ON "public"."_ResponsibleToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_user_id_key" ON "public"."drivers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsibles_user_id_key" ON "public"."responsibles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "public"."students"("user_id");

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responsibles" ADD CONSTRAINT "responsibles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."drivers" ADD CONSTRAINT "drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_itineraries" ADD CONSTRAINT "student_itineraries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_itineraries" ADD CONSTRAINT "student_itineraries_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."routes" ADD CONSTRAINT "routes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "public"."places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ResponsibleToStudent" ADD CONSTRAINT "_ResponsibleToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."responsibles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ResponsibleToStudent" ADD CONSTRAINT "_ResponsibleToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
