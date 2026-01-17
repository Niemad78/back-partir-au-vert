import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { PartenaireCreation } from './partenaires.dto';
import { LinkImage } from 'src/images/images.dto';
import { ImagesService } from 'src/images/images.service';
import { deleteFile } from 'src/file-utils';

@Controller('partenaires')
export class PartenairesController {
  constructor(
    private readonly partenairesService: PartenairesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllPartenaires() {
    const result = await this.partenairesService.findMany();

    return { ok: true, partenaires: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createPartenaire(
    @Body()
    body: PartenaireCreation,
  ) {
    const { nom, imageId } = body;
    const serviceBody: PartenaireCreation = { nom };

    const result = await this.partenairesService.create(serviceBody);

    if (imageId) {
      const imageBody: LinkImage = {
        partenaireId: result.id,
      };

      await this.imagesService.update(imageId, imageBody);
    }

    return { ok: true, partenaire: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  public async deletePartenaire(
    @Param('id')
    id: string,
  ) {
    const partenaire = await this.partenairesService.findOne(id);

    if (!partenaire) {
      return { ok: false, message: 'Partenaire non trouvé' };
    }

    const image = partenaire.image;

    if (!image) {
      await this.partenairesService.delete(id);
      return { ok: true, message: 'Partenaire supprimé avec succès' };
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

    await this.partenairesService.delete(id);

    return { ok: true, message: 'Partenaire supprimé avec succès' };
  }
}
