import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ActiviteCreation,
  ActiviteOutput,
  ActivitePrismaPayload,
} from './activites.dto';

@Injectable()
export class ActivitesService {
  constructor(private readonly prismaService: PrismaService) {}

  private toOutput(activite: ActivitePrismaPayload): ActiviteOutput {
    return {
      id: activite.id,
      nom: activite.nom,
      description: activite.description,
      prix: activite.prix,
      ville: activite.ville,
      departement: activite.departement,
      nbPersonnesMax: activite.nbPersonnesMax,
      duree: activite.duree,
      themes: activite.themeOnActivites.map((x) => x.theme),
      images: activite.images,
    };
  }

  async findMany(): Promise<ActiviteOutput[]> {
    const resultat = await this.prismaService.activite.findMany({
      include: {
        themeOnActivites: { include: { theme: true } },
        pointFort: true,
        images: true,
      },
    });

    return resultat.map((activite) => this.toOutput(activite));
  }

  async findOne(id: string): Promise<ActiviteOutput | null> {
    const resultat = await this.prismaService.activite.findUnique({
      include: {
        themeOnActivites: { include: { theme: true } },
        pointFort: true,
        images: true,
      },
      where: { id },
    });

    return resultat ? this.toOutput(resultat) : null;
  }

  async create(body: ActiviteCreation): Promise<ActiviteOutput> {
    const { themeIds, ...data } = body;
    const resultat = await this.prismaService.activite.create({
      data: {
        ...data,
        themeOnActivites: {
          create: themeIds.map((themeId) => ({ themeId })),
        },
      },
      include: {
        themeOnActivites: { include: { theme: true } },
        pointFort: true,
        images: true,
      },
    });

    return this.toOutput(resultat);
  }

  async update(id: string, body: ActiviteCreation): Promise<ActiviteOutput> {
    const { themeIds, ...data } = body;
    const uniqueThemeIds = [...new Set(themeIds)];

    const resultat = await this.prismaService.activite.update({
      where: { id },
      data: {
        ...data,
        themeOnActivites: {
          deleteMany: {
            themeId: { notIn: uniqueThemeIds },
          },
          createMany: {
            data: uniqueThemeIds.map((themeId) => ({ themeId })),
            skipDuplicates: true,
          },
        },
      },
      include: {
        themeOnActivites: { include: { theme: true } },
        pointFort: true,
        images: true,
      },
    });

    return this.toOutput(resultat);
  }

  async delete(id: string) {
    return this.prismaService.activite.delete({
      where: { id },
    });
  }
}
