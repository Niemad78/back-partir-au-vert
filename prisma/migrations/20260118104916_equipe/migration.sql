/*
  Warnings:

  - A unique constraint covering the columns `[equipeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `equipeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Equipe` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Image_equipeId_key` ON `Image`(`equipeId`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
