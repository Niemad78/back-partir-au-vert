import { Module } from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { PartenairesController } from './partenaires.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PartenairesController],
  providers: [PrismaService, PartenairesService],
})
export class PartenairesModule {}
