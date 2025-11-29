/*
  Warnings:

  - You are about to drop the `ImageBucketActivite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageBucketTheme` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[themeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ImageBucketActivite` DROP FOREIGN KEY `ImageBucketActivite_activiteId_fkey`;

-- DropForeignKey
ALTER TABLE `ImageBucketActivite` DROP FOREIGN KEY `ImageBucketActivite_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `ImageBucketTheme` DROP FOREIGN KEY `ImageBucketTheme_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `ImageBucketTheme` DROP FOREIGN KEY `ImageBucketTheme_themeId_fkey`;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `activiteId` VARCHAR(191) NULL,
    ADD COLUMN `themeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ImageBucketActivite`;

-- DropTable
DROP TABLE `ImageBucketTheme`;

-- CreateIndex
CREATE UNIQUE INDEX `Image_themeId_key` ON `Image`(`themeId`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
