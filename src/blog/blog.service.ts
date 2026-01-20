import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ArticleCreation, ArticleOutput } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<ArticleOutput[]> {
    return this.prismaService.article.findMany({
      include: {
        images: true,
        user: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<ArticleOutput | null> {
    return this.prismaService.article.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
    });
  }

  async create(body: ArticleCreation): Promise<ArticleOutput> {
    return await this.prismaService.article.create({
      data: body,
      include: {
        images: true,
        user: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
    });
  }

  async update(id: string, body: ArticleCreation): Promise<ArticleOutput> {
    return this.prismaService.article.update({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            nom: true,
            prenom: true,
          },
        },
      },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.article.delete({
      where: { id },
    });
  }
}
