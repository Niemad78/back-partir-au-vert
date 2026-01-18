import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EquipeCreation, EquipeOutput } from './equipes.dto';

@Injectable()
export class EquipesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<EquipeOutput[]> {
    return this.prismaService.equipe.findMany({
      include: { image: true },
    });
  }

  async findOne(id: string): Promise<EquipeOutput | null> {
    return this.prismaService.equipe.findUnique({
      where: { id },
      include: { image: true },
    });
  }

  async create(body: EquipeCreation): Promise<EquipeOutput> {
    return await this.prismaService.equipe.create({
      data: body,
    });
  }

  async update(id: string, body: EquipeCreation): Promise<EquipeOutput> {
    return this.prismaService.equipe.update({
      where: { id },
      include: { image: true },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.equipe.delete({
      where: { id },
    });
  }
}
