import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [],
  providers: [ImagesService, PrismaService],
})
export class ImagesModule {}
