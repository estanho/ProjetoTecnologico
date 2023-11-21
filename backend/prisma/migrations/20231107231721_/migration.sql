/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `responsibles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "responsibles_email_key" ON "public"."responsibles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "public"."students"("email");
