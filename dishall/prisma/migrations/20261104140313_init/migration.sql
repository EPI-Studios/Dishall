-- CreateEnum
CREATE TYPE "Role" AS ENUM ('member', 'moderator', 'admin');

-- CreateTable
CREATE TABLE "server" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "guild_id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "country" VARCHAR(5) NOT NULL,
    "icon" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "discord_id" VARCHAR(20) NOT NULL,
    "pseudo" VARCHAR(50) NOT NULL,
    "avatar" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_stats" (
    "id" SERIAL NOT NULL,
    "server_bump" BOOLEAN NOT NULL DEFAULT false,
    "last_bump_at" TIMESTAMP(3) NOT NULL,
    "users_nb" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "server_id" INTEGER NOT NULL,

    CONSTRAINT "server_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "total_score" INTEGER NOT NULL,
    "completitude" INTEGER NOT NULL,
    "activity" INTEGER NOT NULL,
    "conformity" INTEGER NOT NULL,
    "critic" INTEGER NOT NULL,
    "server_id" INTEGER NOT NULL,

    CONSTRAINT "score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "critic" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "critic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mod_action" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "action" VARCHAR(30) NOT NULL,
    "reason" TEXT NOT NULL,
    "target" VARCHAR(36) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "mod_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "slug" VARCHAR(20) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "user_uuid" UUID NOT NULL,
    "critic_uuid" UUID NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("user_uuid","critic_uuid")
);

-- CreateTable
CREATE TABLE "server_tag" (
    "server_uuid" UUID NOT NULL,
    "tag_uuid" UUID NOT NULL,

    CONSTRAINT "server_tag_pkey" PRIMARY KEY ("server_uuid","tag_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "server_uuid_key" ON "server"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "server_guild_id_key" ON "server"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "server_user_id_key" ON "server"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_discord_id_key" ON "user"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "server_stats_server_id_key" ON "server_stats"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_uuid_key" ON "score"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "score_server_id_key" ON "score"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "critic_uuid_key" ON "critic"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "mod_action_uuid_key" ON "mod_action"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tag_uuid_key" ON "tag"("uuid");

-- AddForeignKey
ALTER TABLE "server" ADD CONSTRAINT "server_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_stats" ADD CONSTRAINT "server_stats_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critic" ADD CONSTRAINT "critic_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critic" ADD CONSTRAINT "critic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mod_action" ADD CONSTRAINT "mod_action_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_critic_uuid_fkey" FOREIGN KEY ("critic_uuid") REFERENCES "critic"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag" ADD CONSTRAINT "server_tag_server_uuid_fkey" FOREIGN KEY ("server_uuid") REFERENCES "server"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_tag" ADD CONSTRAINT "server_tag_tag_uuid_fkey" FOREIGN KEY ("tag_uuid") REFERENCES "tag"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
