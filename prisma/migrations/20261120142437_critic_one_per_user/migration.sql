/*
  Warnings:

  - A unique constraint covering the columns `[server_id,user_id]` on the table `critic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('member', 'moderator', 'admin');

-- CreateIndex
CREATE UNIQUE INDEX "critic_server_id_user_id_key" ON "critic"("server_id", "user_id");
