import { Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesController } from './equipes.controller';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [EquipesController],
  providers: [PrismaService, EquipesService, ImagesService],
})
export class EquipesModule {}
