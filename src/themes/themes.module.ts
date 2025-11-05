import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';

@Module({
  controllers: [ThemesController],
  providers: [PrismaService, ThemesService],
})
export class ThemesModule {}
