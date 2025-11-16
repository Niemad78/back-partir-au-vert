import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PointsFortDto, PointsFortOutput } from './points-fort.dto';

@Injectable()
export class PointsFortService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<PointsFortOutput[]> {
    return this.prismaService.pointFort.findMany({
      include: { activite: true },
    });
  }

  async findOne(id: string): Promise<PointsFortOutput | null> {
    return this.prismaService.pointFort.findUnique({
      include: { activite: true },
      where: { id },
    });
  }

  async create(body: PointsFortDto): Promise<PointsFortOutput> {
    return await this.prismaService.pointFort.create({
      data: body,
    });
  }

  async update(id: string, body: PointsFortDto): Promise<PointsFortOutput> {
    return this.prismaService.pointFort.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.pointFort.delete({
      where: { id },
    });
  }
}
