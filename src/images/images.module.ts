import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { PrismaService } from 'src/prisma.service';
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, PrismaService],
})
export class ImagesModule {}
