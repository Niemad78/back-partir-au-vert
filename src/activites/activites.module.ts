import { Module } from '@nestjs/common';
import { ActivitesController } from './activites.controller';
import { ActivitesService } from './activites.service';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [ActivitesController],
  providers: [PrismaService, ActivitesService, ImagesService],
})
export class ActivitesModule {}
