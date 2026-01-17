import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PartenaireCreation, PartenaireOutput } from './partenaires.dto';

@Injectable()
export class PartenairesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<PartenaireOutput[]> {
    return this.prismaService.partenaire.findMany();
  }

  async create(body: PartenaireCreation): Promise<PartenaireOutput> {
    return await this.prismaService.partenaire.create({
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.partenaire.delete({
      where: { id },
    });
  }
}
