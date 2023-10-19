/*
  Warnings:

  - You are about to drop the `destinations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_source_id_fkey";

-- DropTable
DROP TABLE "destinations";

-- DropTable
DROP TABLE "sources";

-- CreateTable
CREATE TABLE "places" (
    "place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("place_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "places_place_id_key" ON "places"("place_id");

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
