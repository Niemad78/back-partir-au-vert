import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { TypePublication } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type {
  PublicationAjoutImage,
  PublicationCreation,
  PublicationModification,
} from './publications.dto';
import { ImagesService } from 'src/images/images.service';
import { LinkImage } from 'src/images/images.dto';
import { deleteFile } from 'src/file-utils';

@Controller('publications')
export class PublicationsController {
  constructor(
    private readonly publicationService: PublicationsService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllPublications() {
    const result = await this.publicationService.findMany();

    return { ok: true, publications: result };
  }

  @Get('liste/:type')
  async getPublications(
    @Param('type')
    type: TypePublication,
  ) {
    const result = await this.publicationService.findManyByType(type);

    return { ok: true, publications: result };
  }

  @Get(':id')
  async getPublicationsById(
    @Param('id')
    id: string,
  ) {
    const result = await this.publicationService.findOne(id);

    return { ok: true, publication: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createPublication(
    @Body()
    body: PublicationCreation,
  ) {
    const result = await this.publicationService.create(body);

    return { ok: true, publication: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('ajout-images/:id')
  async updateImagePublication(
    @Param('id')
    id: string,
    @Body()
    body: PublicationAjoutImage,
  ) {
    const { imageIds } = body;

    if (!imageIds || imageIds.length === 0) {
      return { ok: false, message: 'Aucune image à ajouter' };
    }

    const publicationId: LinkImage = { publicationId: id };

    for (const imageId of imageIds) {
      await this.imagesService.update(imageId, publicationId);
    }

    return { ok: true, message: 'Images ajoutées' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updatePublication(
    @Param('id')
    id: string,
    @Body()
    body: PublicationModification,
  ) {
    const result = await this.publicationService.update(id, body);

    return { ok: true, publication: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deletePublication(
    @Param('id')
    id: string,
  ) {
    const publication = await this.publicationService.findOne(id);

    if (!publication) {
      return { ok: false, message: 'Publication non trouvée' };
    }

    const images = publication.images;

    if (!images || images.length === 0) {
      await this.publicationService.delete(id);
      return { ok: true };
    }

    for (const image of images) {
      if (!image) {
        return { ok: false, message: 'Image non trouvée' };
      }

      try {
        await deleteFile(image.nom);
      } catch {
        throw new InternalServerErrorException(
          'Erreur lors de la suppression du fichier',
        );
      }

      await this.imagesService.delete(image.id);
    }

    await this.publicationService.delete(id);

    return { ok: true };
  }
}
