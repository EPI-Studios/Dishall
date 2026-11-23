/*
  Warnings:

  - You are about to drop the column `server_bump` on the `server_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "server" ADD COLUMN     "score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "server_stats" DROP COLUMN "server_bump";
