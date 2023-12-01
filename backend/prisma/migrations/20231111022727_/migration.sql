-- AlterTable
ALTER TABLE "public"."itineraries" ADD COLUMN     "arrival_time" TIMESTAMP(3),
ADD COLUMN     "departure_time" TIMESTAMP(3),
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "going" BOOLEAN,
ADD COLUMN     "return" BOOLEAN,
ALTER COLUMN "finished_at" DROP NOT NULL,
ALTER COLUMN "started_at" DROP NOT NULL;
