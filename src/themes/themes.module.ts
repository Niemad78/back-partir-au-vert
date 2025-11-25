import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [ThemesController],
  providers: [PrismaService, ThemesService, ImagesService],
})
export class ThemesModule {}
