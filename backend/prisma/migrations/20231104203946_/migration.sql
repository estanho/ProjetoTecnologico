-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "schools_itinerary_id_fkey";

-- AlterTable
ALTER TABLE "public"."schools" ALTER COLUMN "morning_arrival" DROP NOT NULL,
ALTER COLUMN "morning_departure" DROP NOT NULL,
ALTER COLUMN "afternoon_arrival" DROP NOT NULL,
ALTER COLUMN "afternoon_departure" DROP NOT NULL,
ALTER COLUMN "night_arrival" DROP NOT NULL,
ALTER COLUMN "night_departure" DROP NOT NULL,
ALTER COLUMN "itinerary_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
