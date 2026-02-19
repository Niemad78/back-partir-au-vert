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
      slug: activite.slug,
      description: activite.description,
      prix: activite.prix,
      ville: activite.ville,
      departement: activite.departement,
      nbPersonnesMax: activite.nbPersonnesMax,
      duree: activite.duree,
      themes: activite.themeOnActivites.map((x) => x.theme),
      images: activite.images,
      pointFort: activite.pointFort,
      latitude: activite.latitude !== null ? Number(activite.latitude) : null,
      longitude:
        activite.longitude !== null ? Number(activite.longitude) : null,
      adresse: activite.adresse,
      accessibilite: activite.accessibilite,
    };
  }

  private buildSlug(nom: string): string {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async generateUniqueSlug(
    nom: string,
    excludeId?: string,
  ): Promise<string> {
    const base = this.buildSlug(nom);
    let slug = base;
    let count = 1;

    while (true) {
      const existing = await this.prismaService.activite.findUnique({
        where: { slug },
      });
      if (!existing || existing.id === excludeId) break;
      slug = `${base}-${count++}`;
    }

    return slug;
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

  async findOneBySlug(slug: string): Promise<ActiviteOutput | null> {
    const resultat = await this.prismaService.activite.findUnique({
      include: {
        themeOnActivites: { include: { theme: true } },
        pointFort: true,
        images: true,
      },
      where: { slug },
    });

    return resultat ? this.toOutput(resultat) : null;
  }

  async create(body: ActiviteCreation): Promise<ActiviteOutput> {
    const { themeIds, ...data } = body;
    const slug = await this.generateUniqueSlug(data.nom);
    const resultat = await this.prismaService.activite.create({
      data: {
        ...data,
        slug,
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
    const slug = await this.generateUniqueSlug(data.nom, id);

    const resultat = await this.prismaService.activite.update({
      where: { id },
      data: {
        ...data,
        slug,
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
