/*
  Warnings:

  - The values [embarked,disembarked] on the enum `TypeTripStudent` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TypeTripStudent_new" AS ENUM ('going', 'return');
ALTER TABLE "public"."students_trips" ALTER COLUMN "type" TYPE "public"."TypeTripStudent_new" USING ("type"::text::"public"."TypeTripStudent_new");
ALTER TYPE "public"."TypeTripStudent" RENAME TO "TypeTripStudent_old";
ALTER TYPE "public"."TypeTripStudent_new" RENAME TO "TypeTripStudent";
DROP TYPE "public"."TypeTripStudent_old";
COMMIT;
