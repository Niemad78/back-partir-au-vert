import { Module } from '@nestjs/common';
import { PointsFortController } from './points-fort.controller';
import { PrismaService } from 'src/prisma.service';
import { PointsFortService } from './points-fort.service';

@Module({
  controllers: [PointsFortController],
  providers: [PrismaService, PointsFortService],
})
export class PointsFortModule {}
