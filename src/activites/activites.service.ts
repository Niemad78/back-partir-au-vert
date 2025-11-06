import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ActiviteDto, ActiviteOutput } from './activites.dto';

@Injectable()
export class ActivitesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<ActiviteOutput[]> {
    return this.prismaService.activite.findMany({
      include: { theme: true },
    });
  }

  async findOne(id: string): Promise<ActiviteOutput | null> {
    return this.prismaService.activite.findUnique({
      include: { theme: true },
      where: { id },
    });
  }

  async create(body: ActiviteDto): Promise<ActiviteOutput> {
    return await this.prismaService.activite.create({
      data: body,
    });
  }

  async update(id: string, body: ActiviteDto): Promise<ActiviteOutput> {
    return this.prismaService.activite.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.activite.delete({
      where: { id },
    });
  }
}
