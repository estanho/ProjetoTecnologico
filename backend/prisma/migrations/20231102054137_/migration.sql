-- DropIndex
DROP INDEX "public"."users_email_key";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "email" DROP NOT NULL;
