import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ThemesService } from './themes.service';
import type { ThemeDto } from './themes.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteFile, storage } from 'src/file-utils';
import { ImagesService } from 'src/images/images.service';

@UseGuards(JwtAuthGuard)
@Controller('themes')
export class ThemesController {
  constructor(
    private readonly themesService: ThemesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('listes')
  async getAllThemes() {
    const result = await this.themesService.findMany();

    return { ok: true, themes: result };
  }

  @Get(':id')
  async getThemeById(
    @Param('id')
    id: string,
  ) {
    const result = await this.themesService.findOne(id);

    return { ok: true, theme: result };
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
      storage: storage,
    }),
  )
  public async createTheme(
    @Body()
    body: ThemeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = await this.themesService.create(body);

    await this.imagesService.create({
      themeId: result.id,
      nom: image.filename,
    });

    return { ok: true, theme: result };
  }

  @Put('update/:id')
  async updateTheme(
    @Param('id')
    id: string,
    @Body()
    body: ThemeDto,
  ) {
    const result = await this.themesService.update(id, body);

    return { ok: true, theme: result };
  }

  @Put('update/:id/image/:imageId')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
      storage: storage,
    }),
  )
  async updateImageTheme(
    @Param('id')
    id: string,
    @Param('imageId')
    imageId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageASupprimer = await this.imagesService.findOne(imageId);

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

    await this.imagesService.delete(imageId);

    await this.imagesService.create({
      themeId: id,
      nom: image.filename,
    });

    const result = await this.themesService.findOne(id);

    return { ok: true, theme: result };
  }

  @Delete('delete/:id')
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
