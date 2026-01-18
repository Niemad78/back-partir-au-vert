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
import { EquipesService } from './equipes.service';
import { ImagesService } from 'src/images/images.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { EquipeCreation, EquipeService } from './equipes.dto';
import { deleteFile } from 'src/file-utils';
import { LinkImage } from 'src/images/images.dto';

@Controller('equipes')
export class EquipesController {
  constructor(
    private readonly equipesService: EquipesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllEquipes() {
    const result = await this.equipesService.findMany();

    return { ok: true, equipes: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEquipeById(
    @Param('id')
    id: string,
  ) {
    const result = await this.equipesService.findOne(id);

    return { ok: true, equipe: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  async createEquipe(
    @Body()
    body: EquipeCreation,
  ) {
    const { nom, description, imageId } = body;
    const equipeBody: EquipeService = { nom, description };

    const result = await this.equipesService.create(equipeBody);

    if (imageId) {
      const imageBody = {
        equipeId: result.id,
      };

      await this.imagesService.update(imageId, imageBody);
    }

    return { ok: true, equipe: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateEquipe(
    @Param('id')
    id: string,
    @Body()
    body: EquipeCreation,
  ) {
    const { nom, description, imageId } = body;
    const equipeBody: EquipeService = { nom, description };

    const result = await this.equipesService.update(id, equipeBody);

    const imageIdASupprimer = result.image?.id;
    if (imageId && imageIdASupprimer && imageId !== imageIdASupprimer) {
      const imageASupprimer =
        await this.imagesService.findOne(imageIdASupprimer);

      if (!imageASupprimer) {
        return { ok: false, message: 'Image non trouvée' };
      }

      try {
        await deleteFile(imageASupprimer.nom);
      } catch {
        throw new InternalServerErrorException(
          'Erreur lors de la suppression du fichier',
        );
      }

      const imageBody: LinkImage = {
        equipeId: result.id,
      };

      await this.imagesService.delete(imageIdASupprimer);
      await this.imagesService.update(imageId, imageBody);
    }

    const resultatFinal = await this.equipesService.findOne(id);

    return { ok: true, equipe: resultatFinal };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deleteEquipe(
    @Param('id')
    id: string,
  ) {
    const equipe = await this.equipesService.findOne(id);

    if (!equipe) {
      return { ok: false, message: 'Équipe non trouvée' };
    }

    const image = equipe.image;

    if (!image) {
      await this.equipesService.delete(id);
      return { ok: true, message: 'Équipe supprimée avec succès' };
    }

    const imageASupprimer = await this.imagesService.findOne(image.id);

    if (!imageASupprimer) {
      return { ok: false, message: 'Image non trouvée' };
    }

    try {
      await deleteFile(imageASupprimer.nom);
    } catch {
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du fichier',
      );
    }

    await this.equipesService.delete(id);

    return { ok: true, message: 'Équipe supprimée avec succès' };
  }
}
