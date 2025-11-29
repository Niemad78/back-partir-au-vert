import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ImageDto, LinkImage } from './images.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    return await this.prismaService.image.findUnique({
      where: { id },
    });
  }

  async create(body: ImageDto) {
    return await this.prismaService.image.create({
      data: body,
    });
  }

  async update(id: string, body: LinkImage) {
    await this.prismaService.image.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    await this.prismaService.image.delete({
      where: { id },
    });
  }
}
