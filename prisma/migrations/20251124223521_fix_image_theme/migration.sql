/*
  Warnings:

  - A unique constraint covering the columns `[themeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Image_themeId_key` ON `Image`(`themeId`);
