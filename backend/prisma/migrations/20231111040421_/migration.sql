-- DropForeignKey
ALTER TABLE "public"."itineraries" DROP CONSTRAINT "itineraries_school_id_fkey";

-- AlterTable
ALTER TABLE "public"."itineraries" ALTER COLUMN "school_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
