/*
  Warnings:

  - A unique constraint covering the columns `[place_id]` on the table `destinations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[place_id]` on the table `sources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "destinations_place_id_key" ON "destinations"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "sources_place_id_key" ON "sources"("place_id");
