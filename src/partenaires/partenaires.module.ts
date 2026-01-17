import { Module } from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { PartenairesController } from './partenaires.controller';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [PartenairesController],
  providers: [PrismaService, PartenairesService, ImagesService],
})
export class PartenairesModule {}
