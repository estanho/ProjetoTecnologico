-- AlterTable
ALTER TABLE "public"."students" ADD COLUMN     "code" UUID NOT NULL DEFAULT gen_random_uuid();
