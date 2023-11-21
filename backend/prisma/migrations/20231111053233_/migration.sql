/*
  Warnings:

  - You are about to drop the column `arrival_time` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `departure_time` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `shift` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `shift` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `shifts` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."schools" DROP COLUMN "arrival_time",
DROP COLUMN "departure_time",
DROP COLUMN "shift",
ADD COLUMN     "afternoon" BOOLEAN,
ADD COLUMN     "afternoon_arrival" TIMESTAMP(3),
ADD COLUMN     "afternoon_departure" TIMESTAMP(3),
ADD COLUMN     "morning" BOOLEAN,
ADD COLUMN     "morning_arrival" TIMESTAMP(3),
ADD COLUMN     "morning_departure" TIMESTAMP(3),
ADD COLUMN     "night" BOOLEAN,
ADD COLUMN     "night_arrival" TIMESTAMP(3),
ADD COLUMN     "night_departure" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."students" DROP COLUMN "shift",
ADD COLUMN     "afternoon" BOOLEAN,
ADD COLUMN     "morning" BOOLEAN,
ADD COLUMN     "night" BOOLEAN;

-- DropTable
DROP TABLE "public"."shifts";
