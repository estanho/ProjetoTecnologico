/*
  Warnings:

  - You are about to drop the `places` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `routes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."routes" DROP CONSTRAINT "routes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."routes" DROP CONSTRAINT "routes_source_id_fkey";

-- DropTable
DROP TABLE "public"."places";

-- DropTable
DROP TABLE "public"."routes";
