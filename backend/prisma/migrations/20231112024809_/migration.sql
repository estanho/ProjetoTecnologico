/*
  Warnings:

  - You are about to drop the column `driver_id` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_driver_id_fkey";

-- DropIndex
DROP INDEX "public"."addresses_driver_id_key";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "driver_id";
