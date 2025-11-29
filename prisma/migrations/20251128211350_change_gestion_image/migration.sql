/*
  Warnings:

  - You are about to drop the column `activiteId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `themeId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_activiteId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_themeId_fkey`;

-- DropIndex
DROP INDEX `Image_activiteId_fkey` ON `Image`;

-- DropIndex
DROP INDEX `Image_themeId_key` ON `Image`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `activiteId`,
    DROP COLUMN `themeId`;

-- CreateTable
CREATE TABLE `ImageBucketActivite` (
    `id` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `activiteId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImageBucketActivite_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageBucketTheme` (
    `id` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `themeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ImageBucketTheme_imageId_key`(`imageId`),
    UNIQUE INDEX `ImageBucketTheme_themeId_key`(`themeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageBucketActivite` ADD CONSTRAINT `ImageBucketActivite_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageBucketActivite` ADD CONSTRAINT `ImageBucketActivite_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageBucketTheme` ADD CONSTRAINT `ImageBucketTheme_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageBucketTheme` ADD CONSTRAINT `ImageBucketTheme_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
