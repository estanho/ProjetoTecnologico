-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_adress_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_school_id_fkey";

-- AlterTable
ALTER TABLE "public"."students" ALTER COLUMN "afternoon" DROP NOT NULL,
ALTER COLUMN "goes" DROP NOT NULL,
ALTER COLUMN "morning" DROP NOT NULL,
ALTER COLUMN "night" DROP NOT NULL,
ALTER COLUMN "return" DROP NOT NULL,
ALTER COLUMN "school_id" DROP NOT NULL,
ALTER COLUMN "adress_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_adress_id_fkey" FOREIGN KEY ("adress_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
