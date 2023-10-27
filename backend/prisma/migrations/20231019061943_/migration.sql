/*
  Warnings:

  - The primary key for the `places` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `places` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_source_id_fkey";

-- DropIndex
DROP INDEX "places_place_id_key";

-- AlterTable
ALTER TABLE "places" DROP CONSTRAINT "places_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
