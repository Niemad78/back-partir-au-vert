/*
  Warnings:

  - You are about to drop the column `themeId` on the `Activite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Activite` DROP FOREIGN KEY `Activite_themeId_fkey`;

-- DropIndex
DROP INDEX `Activite_themeId_fkey` ON `Activite`;

-- AlterTable
ALTER TABLE `Activite` DROP COLUMN `themeId`;

-- CreateTable
CREATE TABLE `ThemeOnActivite` (
    `activiteId` VARCHAR(191) NOT NULL,
    `themeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`activiteId`, `themeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ThemeOnActivite` ADD CONSTRAINT `ThemeOnActivite_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThemeOnActivite` ADD CONSTRAINT `ThemeOnActivite_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
