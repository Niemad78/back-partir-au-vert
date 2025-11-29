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
import { ThemesService } from './themes.service';
import type { ThemeDto, ThemeService } from './themes.dto';
import { deleteFile } from 'src/file-utils';
import { ImagesService } from 'src/images/images.service';
import { LinkImage } from 'src/images/images.dto';

@Controller('themes')
export class ThemesController {
  constructor(
    private readonly themesService: ThemesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllThemes() {
    const result = await this.themesService.findMany();

    return { ok: true, themes: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getThemeById(
    @Param('id')
    id: string,
  ) {
    const result = await this.themesService.findOne(id);

    return { ok: true, theme: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createTheme(
    @Body()
    body: ThemeDto,
  ) {
    const { nom, imageId } = body;
    const serviceBody: ThemeService = { nom };

    const result = await this.themesService.create(serviceBody);

    if (imageId) {
      const imageBody: LinkImage = {
        themeId: result.id,
      };

      await this.imagesService.update(imageId, imageBody);
    }

    return { ok: true, theme: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateTheme(
    @Param('id')
    id: string,
    @Body()
    body: ThemeDto,
  ) {
    const { nom, imageId } = body;
    const serviceBody: ThemeService = { nom };

    const result = await this.themesService.update(id, serviceBody);

    const imageIdASupprimer = result.image?.id;
    if (imageId && imageIdASupprimer) {
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
        themeId: result.id,
      };

      await this.imagesService.delete(imageIdASupprimer);
      await this.imagesService.update(imageId, imageBody);
    }

    const resultatFinal = await this.themesService.findOne(id);

    return { ok: true, theme: resultatFinal };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deleteTheme(
    @Param('id')
    id: string,
  ) {
    const theme = await this.themesService.findOne(id);

    if (!theme) {
      return { ok: false, message: 'Thème non trouvé' };
    }

    const image = theme.image;

    if (!image) {
      await this.themesService.delete(id);
      return { ok: true, message: 'Thème supprimé avec succès' };
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

    await this.themesService.delete(id);

    return { ok: true, message: 'Thème supprimé avec succès' };
  }
}
