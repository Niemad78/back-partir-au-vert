import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type {
  PublicationCreation,
  PublicationModification,
  PublicationOutput,
} from './publications.dto';
import { TypePublication } from '@prisma/client';

@Injectable()
export class PublicationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByType(type: TypePublication): Promise<PublicationOutput[]> {
    return this.prismaService.publication.findMany({
      where: { type },
      include: { images: true },
    });
  }

  async findOne(id: string): Promise<PublicationOutput | null> {
    return this.prismaService.publication.findUnique({
      include: { images: true },
      where: { id },
    });
  }

  async create(body: PublicationCreation): Promise<PublicationOutput> {
    return await this.prismaService.publication.create({
      data: body,
      include: { images: true },
    });
  }

  async update(
    id: string,
    body: PublicationModification,
  ): Promise<PublicationOutput> {
    return this.prismaService.publication.update({
      where: { id },
      data: body,
      include: { images: true },
    });
  }

  async delete(id: string) {
    return this.prismaService.publication.delete({
      where: { id },
    });
  }
}
