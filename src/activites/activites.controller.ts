import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActivitesService } from './activites.service';
import type { ActiviteDto, ActiviteFormData } from './activites.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { deleteFile, storage } from 'src/file-utils';
import { ImagesService } from 'src/images/images.service';

@UseGuards(JwtAuthGuard)
@Controller('activites')
export class ActivitesController {
  constructor(
    private readonly activitesService: ActivitesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('listes')
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

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('images', undefined, {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
      storage: storage,
    }),
  )
  public async createActivite(
    @Body()
    body: ActiviteFormData,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const data: ActiviteDto = {
      nom: body.nom,
      description: body.description,
      prix: parseFloat(body.prix),
      ville: body.ville,
      departement: parseInt(body.departement, 10),
      nbPersonnesMax: parseInt(body.nbPersonnesMax, 10),
      themeId: body.themeId,
    };

    const result = await this.activitesService.create(data);

    for (const image of images) {
      await this.imagesService.create({
        activiteId: result.id,
        nom: image.filename,
      });
    }

    return { ok: true, activite: result };
  }

  @Put('update/:id')
  async updateActivite(
    @Param('id')
    id: string,
    @Body()
    body: ActiviteDto,
  ) {
    const result = await this.activitesService.update(id, body);

    return { ok: true, activite: result };
  }

  @Put('update/:id/images')
  @UseInterceptors(
    FilesInterceptor('images', undefined, {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
      storage: storage,
    }),
  )
  async updateImageActivite(
    @Param('id')
    id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    for (const image of images) {
      await this.imagesService.create({
        activiteId: id,
        nom: image.filename,
      });
    }

    const result = await this.activitesService.findOne(id);

    return { ok: true, activite: result };
  }

  @Delete('delete/:id')
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

  @Delete('delete/:id/image/:imageId')
  async deleteImageActivite(
    @Param('id')
    id: string,
    @Param('imageId')
    imageId: string,
  ) {
    const image = await this.imagesService.findOne(imageId);

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

    await this.imagesService.delete(imageId);

    const result = await this.activitesService.findOne(id);

    return { ok: true, activite: result };
  }
}
