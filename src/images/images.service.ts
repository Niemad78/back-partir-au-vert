import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { deleteFile } from 'src/file-utils';
import { ImageDto, LinkImage } from './images.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    return await this.prismaService.image.findUnique({
      where: { id },
    });
  }

  async create(body: ImageDto) {
    return await this.prismaService.image.create({
      data: body,
    });
  }

  async update(id: string, body: LinkImage) {
    await this.prismaService.image.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    await this.prismaService.image.delete({
      where: { id },
    });
  }

  async countNonLiees(): Promise<number> {
    return await this.prismaService.image.count({
      where: {
        activiteId: null,
        themeId: null,
        publicationId: null,
        partenaireId: null,
        equipeId: null,
        articleId: null,
      },
    });
  }

  async supprimerNonLiees(): Promise<number> {
    const images = await this.prismaService.image.findMany({
      where: {
        activiteId: null,
        themeId: null,
        publicationId: null,
        partenaireId: null,
        equipeId: null,
        articleId: null,
      },
    });

    for (const image of images) {
      await deleteFile(image.nom);
    }

    const { count } = await this.prismaService.image.deleteMany({
      where: {
        activiteId: null,
        themeId: null,
        publicationId: null,
        partenaireId: null,
        equipeId: null,
        articleId: null,
      },
    });

    return count;
  }
}
