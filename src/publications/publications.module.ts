import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [PublicationsController],
  providers: [PrismaService, PublicationsService, ImagesService],
})
export class PublicationsModule {}
