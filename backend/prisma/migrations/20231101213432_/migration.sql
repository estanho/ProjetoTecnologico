-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "cellphone" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;