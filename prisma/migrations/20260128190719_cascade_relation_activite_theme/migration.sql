-- DropForeignKey
ALTER TABLE `ThemeOnActivite` DROP FOREIGN KEY `ThemeOnActivite_activiteId_fkey`;

-- DropForeignKey
ALTER TABLE `ThemeOnActivite` DROP FOREIGN KEY `ThemeOnActivite_themeId_fkey`;

-- DropIndex
DROP INDEX `ThemeOnActivite_themeId_fkey` ON `ThemeOnActivite`;

-- AddForeignKey
ALTER TABLE `ThemeOnActivite` ADD CONSTRAINT `ThemeOnActivite_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThemeOnActivite` ADD CONSTRAINT `ThemeOnActivite_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
