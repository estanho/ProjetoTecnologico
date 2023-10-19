/*
  Warnings:

  - The primary key for the `destinations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `destinations` table. All the data in the column will be lost.
  - The primary key for the `sources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `sources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_source_id_fkey";

-- AlterTable
ALTER TABLE "destinations" DROP CONSTRAINT "destinations_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "destinations_pkey" PRIMARY KEY ("place_id");

-- AlterTable
ALTER TABLE "sources" DROP CONSTRAINT "sources_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("place_id");

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
