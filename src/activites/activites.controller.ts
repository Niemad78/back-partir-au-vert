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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActivitesService } from './activites.service';
import type {
  ActiviteAjoutImage,
  ActiviteCreation,
  ActiviteModification,
} from './activites.dto';
import { deleteFile } from 'src/file-utils';
import { ImagesService } from 'src/images/images.service';
import { LinkImage } from 'src/images/images.dto';

@Controller('activites')
export class ActivitesController {
  constructor(
    private readonly activitesService: ActivitesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllActivites() {
    const result = await this.activitesService.findMany();

    return { ok: true, activites: result };
  }

  @Get('slug/:slug')
  async getActiviteBySlug(
    @Param('slug')
    slug: string,
  ) {
    const result = await this.activitesService.findOneBySlug(slug);

    return { ok: true, activite: result };
  }

  @Get(':id')
  async getActiviteById(
    @Param('id')
    id: string,
  ) {
    const result = await this.activitesService.findOne(id);

    return { ok: true, activite: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('generer-slugs')
  async genererSlugsManquants() {
    const count = await this.activitesService.generateMissingSlugs();

    return { ok: true, message: `${count} slug(s) généré(s)` };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createActivite(
    @Body()
    body: ActiviteCreation,
  ) {
    const result = await this.activitesService.create(body);

    return { ok: true, activite: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateActivite(
    @Param('id')
    id: string,
    @Body()
    body: ActiviteModification,
  ) {
    const result = await this.activitesService.update(id, body);

    return { ok: true, activite: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('ajout-images/:id')
  async updateImageActivite(
    @Param('id')
    id: string,
    @Body()
    body: ActiviteAjoutImage,
  ) {
    const { imageIds } = body;

    if (!imageIds || imageIds.length === 0) {
      return { ok: false, message: 'Aucune image à ajouter' };
    }

    const activiteId: LinkImage = { activiteId: id };

    for (const imageId of imageIds) {
      await this.imagesService.update(imageId, activiteId);
    }

    return { ok: true, message: 'Images ajoutées' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deleteActivite(
    @Param('id')
    id: string,
  ) {
    const activite = await this.activitesService.findOne(id);

    if (!activite) {
      return { ok: false, message: 'Activité non trouvée' };
    }

    const images = activite.images;

    if (!images || images.length === 0) {
      await this.activitesService.delete(id);
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

    await this.activitesService.delete(id);

    return { ok: true };
  }
}
