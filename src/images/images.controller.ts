import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ImagesService } from './images.service';
import { deleteFile, storage } from 'src/file-utils';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('telecharger-plusieurs')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    }),
  )
  public async uploadImages(
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const ids: string[] = [];

    for (const image of images) {
      const createdImage = await this.imagesService.create({
        nom: image.filename,
      });
      ids.push(createdImage.id);
    }
    return { ok: true, imageIds: ids };
  }

  @Post('telecharger')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    }),
  )
  public async uploadImage(@UploadedFile() image: Express.Multer.File) {
    const createdImage = await this.imagesService.create({
      nom: image.filename,
    });

    return { ok: true, imageId: createdImage.id };
  }

  @Get('/non-liees/nombre')
  public async getNombreNonLiees() {
    const nombre = await this.imagesService.countNonLiees();
    return { ok: true, nombre };
  }

  @Delete('/non-liees')
  public async supprimerNonLiees() {
    const nombre = await this.imagesService.supprimerNonLiees();
    return { ok: true, nombre };
  }

  @Delete('/suppression/:id')
  public async deleteImage(@Param('id') id: string) {
    const imageASupprimer = await this.imagesService.findOne(id);

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

    await this.imagesService.delete(id);

    return { ok: true };
  }
}
