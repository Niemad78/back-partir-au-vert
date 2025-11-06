import { Module } from '@nestjs/common';
import { ActivitesController } from './activites.controller';
import { ActivitesService } from './activites.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ActivitesController],
  providers: [PrismaService, ActivitesService],
})
export class ActivitesModule {}
