/*
  Warnings:

  - You are about to drop the column `dest_lat` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `dest_lon` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `dest_name` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `source_lat` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `source_lon` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `source_name` on the `routes` table. All the data in the column will be lost.
  - Added the required column `destination_id` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "routes" DROP COLUMN "dest_lat",
DROP COLUMN "dest_lon",
DROP COLUMN "dest_name",
DROP COLUMN "source_lat",
DROP COLUMN "source_lon",
DROP COLUMN "source_name",
ADD COLUMN     "destination_id" TEXT NOT NULL,
ADD COLUMN     "source_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
