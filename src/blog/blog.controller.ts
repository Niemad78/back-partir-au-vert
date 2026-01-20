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
import { BlogService } from './blog.service';
import { ImagesService } from 'src/images/images.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type {
  ArticleAjoutImage,
  ArticleCreation,
  ArticleModification,
} from './blog.dto';
import { LinkImage } from 'src/images/images.dto';
import { deleteFile } from 'src/file-utils';

@Controller('articles')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('liste')
  async getAllArticles() {
    const result = await this.blogService.findMany();

    return { ok: true, articles: result };
  }

  @Get(':id')
  async getArticleById(
    @Param('id')
    id: string,
  ) {
    const result = await this.blogService.findOne(id);

    return { ok: true, article: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createArticle(
    @Body()
    body: ArticleCreation,
  ) {
    const result = await this.blogService.create(body);

    return { ok: true, article: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateArticle(
    @Param('id')
    id: string,
    @Body()
    body: ArticleModification,
  ) {
    const result = await this.blogService.update(id, body);

    return { ok: true, article: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('ajout-images/:id')
  async updateImageArticle(
    @Param('id')
    id: string,
    @Body()
    body: ArticleAjoutImage,
  ) {
    const { imageIds } = body;

    if (!imageIds || imageIds.length === 0) {
      return { ok: false, message: 'Aucune image à ajouter' };
    }

    const articleId: LinkImage = { articleId: id };

    for (const imageId of imageIds) {
      await this.imagesService.update(imageId, articleId);
    }

    return { ok: true, message: 'Images ajoutées' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deleteArticle(
    @Param('id')
    id: string,
  ) {
    const article = await this.blogService.findOne(id);

    if (!article) {
      return { ok: false, message: 'Article non trouvé' };
    }

    const images = article.images;

    if (!images || images.length === 0) {
      await this.blogService.delete(id);
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

    await this.blogService.delete(id);

    return { ok: true };
  }
}
