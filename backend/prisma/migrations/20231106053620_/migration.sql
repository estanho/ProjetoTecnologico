/*
  Warnings:

  - You are about to drop the column `adress_id` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `adress_id` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[school_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `school_id` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_adress_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_adress_id_fkey";

-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "school_id" UUID NOT NULL,
ADD COLUMN     "student_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."schools" DROP COLUMN "adress_id";

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "adress_id";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_school_id_key" ON "public"."addresses"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_student_id_key" ON "public"."addresses"("student_id");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
