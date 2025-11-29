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
import type { ActiviteDto, ActiviteService } from './activites.dto';
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

  @Get(':id')
  async getActiviteById(
    @Param('id')
    id: string,
  ) {
    const result = await this.activitesService.findOne(id);

    return { ok: true, activite: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createActivite(
    @Body()
    body: ActiviteDto,
  ) {
    const {
      nom,
      description,
      prix,
      ville,
      departement,
      nbPersonnesMax,
      themeId,
      imageIds,
    } = body;
    const serviceBody: ActiviteService = {
      nom,
      description,
      prix,
      ville,
      departement,
      nbPersonnesMax,
      themeId,
    };

    const result = await this.activitesService.create(serviceBody);

    if (imageIds && imageIds.length > 0) {
      for (const imageId of imageIds) {
        const imageBody: LinkImage = {
          activiteId: result.id,
        };

        await this.imagesService.update(imageId, imageBody);
      }
    }

    return { ok: true, activite: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateActivite(
    @Param('id')
    id: string,
    @Body()
    body: ActiviteDto,
  ) {
    const result = await this.activitesService.update(id, body);

    return { ok: true, activite: result };
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
